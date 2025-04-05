import numpy as np
from typing import List, Dict, Tuple
import psycopg2
from database_config import DB_CONFIG

class TourRecommendation:
    def __init__(self, connection_pool):
        # Lưu connection pool
        self.connection_pool = connection_pool
        
        # Định nghĩa các thuộc tính có giá trị càng gần càng tốt
        self.closer_better = ['gia', 'so_ngay']
        
        # Định nghĩa các thuộc tính có giá trị càng cao càng tốt
        self.higher_better = ['loai_hinh', 'am_thuc', 'phuong_tien']
        
        # Định nghĩa các thuộc tính có giá trị càng thấp càng tốt
        self.lower_better = []
        
        # Khởi tạo các ma trận tương quan từ database
        self.tour_types = self._load_correlation_matrix('TUONG_QUAN_LOAI_HINH', 'LOAI_HINH_1', 'LOAI_HINH_2')
        self.cuisines = self._load_correlation_matrix('TUONG_QUAN_AM_THUC', 'AM_THUC_1', 'AM_THUC_2')
        self.transportation = self._load_correlation_matrix('TUONG_QIAN_PHUONG_TIEN', 'PHUONG_TIEN_1', 'PHUONG_TIEN_2')

    def _load_correlation_matrix(self, table_name: str, propertie1: int, propertie2: int) -> Dict[int, Dict[int, float]]:
        """Load ma trận tương quan từ database sử dụng connection pool"""
        matrix = {}
        conn = None
        try:
            # Lấy kết nối từ pool
            conn = self.connection_pool.getconn()
            cur = conn.cursor()
            
            # Lấy dữ liệu từ bảng tương quan
            cur.execute(f"""
                SELECT "{propertie1}", "{propertie2}", "DIEM"
                FROM public."{table_name}" 
            """)
            
            for row in cur.fetchall():
                id1, id2, score = row
                if id1 not in matrix:
                    matrix[id1] = {}
                matrix[id1][id2] = score
                
            cur.close()
            
        except Exception as e:
            print(f"Lỗi khi load ma trận tương quan từ {table_name}: {str(e)}")
            return {}
        finally:
            # Trả kết nối về pool
            if conn:
                self.connection_pool.putconn(conn)
            
        return matrix

    def get_correlation_score(self, matrix: Dict[int, Dict[int, float]], id1: int, id2: int) -> float:
        """Lấy điểm tương quan giữa hai ID"""
        if id1 in matrix and id2 in matrix[id1]:
            return matrix[id1][id2]
        elif id2 in matrix and id1 in matrix[id2]:
            return matrix[id2][id1]
        return 0.0

    def normalize_matrix(self, matrix, attribute):
        """Chuẩn hóa ma trận theo thuộc tính"""
        if attribute in self.closer_better:
            # Sử dụng min-max normalization với đảo ngược cho các thuộc tính càng gần càng tốt
            min_val = np.min(matrix)
            max_val = np.max(matrix)
            if max_val == min_val:
                return np.ones_like(matrix)  # Trả về ma trận toàn số 1 nếu max = min
            return 1 - (matrix - min_val) / (max_val - min_val)
        elif attribute in self.higher_better:
            # Sử dụng min-max normalization cho các thuộc tính càng cao càng tốt
            min_val = np.min(matrix)
            max_val = np.max(matrix)
            if max_val == min_val:
                return np.ones_like(matrix)  # Trả về ma trận toàn số 1 nếu max = min
            return (matrix - min_val) / (max_val - min_val)
        else:
            # Sử dụng min-max normalization cho các thuộc tính càng thấp càng tốt
            min_val = np.min(matrix)
            max_val = np.max(matrix)
            if max_val == min_val:
                return np.ones_like(matrix)  # Trả về ma trận toàn số 1 nếu max = min
            return (max_val - matrix) / (max_val - min_val)

    def calculate_weights(self, priorities):
        """Tính toán trọng số dựa trên mức độ ưu tiên"""
        # Tính tổng mức độ ưu tiên
        total_priority = sum(priorities.values())
        
        # Tính trọng số cho từng thuộc tính
        weights = {}
        for attr, priority in priorities.items():
            weights[attr] = priority / total_priority
            
        return weights

    def calculate_weighted_matrix(self, normalized_matrix: np.ndarray, weights: Dict[str, float]) -> np.ndarray:
        """Tính ma trận trọng số"""
        return normalized_matrix * list(weights.values())

    def find_ideal_solutions(self, weighted_matrix: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Tìm giải pháp lý tưởng dương và âm"""
        ideal_positive = np.max(weighted_matrix, axis=0)
        ideal_negative = np.min(weighted_matrix, axis=0)
        return ideal_positive, ideal_negative

    def calculate_distances(self, weighted_matrix: np.ndarray, 
                          ideal_positive: np.ndarray, 
                          ideal_negative: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Tính khoảng cách đến giải pháp lý tưởng"""
        d_positive = np.sqrt(np.sum((weighted_matrix - ideal_positive)**2, axis=1))
        d_negative = np.sqrt(np.sum((weighted_matrix - ideal_negative)**2, axis=1))
        return d_positive, d_negative

    def calculate_scores(self, d_positive: np.ndarray, d_negative: np.ndarray) -> np.ndarray:
        """Tính điểm TOPSIS"""
        # Thêm một số nhỏ để tránh chia cho 0
        epsilon = 1e-10
        scores = d_negative / (d_positive + d_negative + epsilon)
        # Thay thế các giá trị NaN bằng 0
        scores = np.nan_to_num(scores, nan=0.0)
        return scores

    def recommend_tours(self, tours: List[Dict], user_input: Dict, priorities: Dict[str, int]) -> List[Tuple[Dict, float]]:
        """
        Gợi ý tour dựa trên TOPSIS
        
        Args:
            tours: Danh sách các tour
            user_input: Input của người dùng (giá, số ngày)
            priorities: Mức độ ưu tiên của các thuộc tính (0-4)
            
        Returns:
            Danh sách các tour được sắp xếp theo điểm TOPSIS
        """
        if not tours:
            print("Không có tour nào để gợi ý")
            return []

        # Chuyển đổi danh sách tour thành ma trận
        matrix = []
        for tour in tours:
            row = [
                abs(tour['gia'] - user_input['gia']),  # Khoảng cách tuyệt đối giữa giá tour và giá mong muốn
                self.get_correlation_score(self.tour_types, user_input['loai_hinh'], tour['loai_hinh']),
                self.get_correlation_score(self.cuisines, user_input['am_thuc'], tour['am_thuc']),
                self.get_correlation_score(self.transportation, user_input['phuong_tien'], tour['phuong_tien']),
                abs(tour['so_ngay'] - user_input['so_ngay'])  # Khoảng cách tuyệt đối giữa số ngày tour và số ngày mong muốn
            ]
            matrix.append(row)
        matrix = np.array(matrix)
        
        # Chuẩn hóa ma trận
        normalized_matrix = np.zeros_like(matrix)
        for i, attr in enumerate(['gia', 'loai_hinh', 'am_thuc', 'phuong_tien', 'so_ngay']):
            normalized_matrix[:, i] = self.normalize_matrix(matrix[:, i], attr)
        
        # Tính trọng số
        weights = self.calculate_weights(priorities)
        
        # Tính ma trận trọng số
        weighted_matrix = self.calculate_weighted_matrix(normalized_matrix, weights)
        
        # Xác định giải pháp lý tưởng dương và âm
        ideal_positive, ideal_negative = self.find_ideal_solutions(weighted_matrix)
        
        # Tính khoảng cách đến giải pháp lý tưởng
        d_positive, d_negative = self.calculate_distances(weighted_matrix, ideal_positive, ideal_negative)
        
        # Tính điểm TOPSIS
        topsis_scores = self.calculate_scores(d_positive, d_negative)
        
        # Sắp xếp các tour theo điểm TOPSIS
        sorted_indices = np.argsort(topsis_scores)[::-1]
        sorted_tours = [(tours[i], float(topsis_scores[i])) for i in sorted_indices]  # Chuyển đổi sang float để đảm bảo JSON serializable
        
        return sorted_tours 