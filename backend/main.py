import psycopg2
from psycopg2 import pool
from database_config import DB_CONFIG
from topsis_tour_recommendation import TourRecommendation
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
from contextlib import asynccontextmanager

# Khởi tạo connection pool
connection_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Quản lý vòng đời của ứng dụng"""
    # Khởi tạo connection pool khi server khởi động
    global connection_pool
    try:
        print(DB_CONFIG)
        connection_pool = pool.SimpleConnectionPool(
            1,  # minconn
            2, # maxconn
            **DB_CONFIG
        )
        print("Đã khởi tạo connection pool thành công")
    except Exception as e:
        print(f"Lỗi khởi tạo connection pool: {str(e)}")
        raise
    
    yield
    
    # Đóng connection pool khi server tắt
    if connection_pool:
        connection_pool.closeall()
        print("Đã đóng connection pool")

app = FastAPI(title="Tour Recommendation API", lifespan=lifespan)

class AttributeInput(BaseModel):
    attribute: str
    value: float
    weight: int

class TourResponse(BaseModel):
    id: int
    ten: str
    gia: float
    loai_hinh: int
    am_thuc: int
    phuong_tien: int
    so_ngay: int
    mo_ta: Optional[str] = None
    url: Optional[str] = None
    topsis_score: float

def get_db_connection():
    """Lấy kết nối từ pool"""
    global connection_pool
    try:
        return connection_pool.getconn()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy kết nối từ pool: {str(e)}")

def return_db_connection(conn):
    """Trả kết nối về pool"""
    global connection_pool
    if conn:
        connection_pool.putconn(conn)

def get_tours_from_db() -> list:
    """Lấy danh sách tour từ database"""
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, "TEN", "GIA", "LOAI_HINH", "AM_THUC", "PHUONG_TIEN", "SO_NGAY", "MO_TA", "URL"
            FROM tour
        """)
        
        tours = []
        for row in cur.fetchall():
            tour = {
                'id': row[0],
                'ten': row[1],
                'gia': row[2],
                'loai_hinh': row[3],
                'am_thuc': row[4],
                'phuong_tien': row[5],
                'so_ngay': row[6],
                'mo_ta': row[7],
                'url': row[8]
            }
            tours.append(tour)
        
        return tours
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy dữ liệu từ database: {str(e)}")
    finally:
        if cur:
            cur.close()
        return_db_connection(conn)

@app.post("/v1.0/api/recommendation_tour", response_model=List[TourResponse])
async def get_tour_recommendations(attributes: List[AttributeInput]):
    """
    API endpoint để gợi ý tour dựa trên các thuộc tính và trọng số
    
    Input: Danh sách các thuộc tính, giá trị mong muốn và trọng số tương ứng
    Output: Top 5 tour được gợi ý với điểm TOPSIS
    """
    try:
        # Chuyển đổi input thành dictionary priorities và user_input
        priorities = {}
        user_input = {}
        
        for attr in attributes:
            priorities[attr.attribute] = attr.weight
            user_input[attr.attribute] = attr.value
        
        # Kiểm tra các thuộc tính bắt buộc
        required_attributes = {'gia', 'loai_hinh', 'am_thuc', 'phuong_tien', 'so_ngay'}
        if not all(attr in priorities for attr in required_attributes):
            raise HTTPException(
                status_code=400,
                detail="Thiếu các thuộc tính bắt buộc: gia, loai_hinh, am_thuc, phuong_tien, so_ngay"
            )
        
        # Kiểm tra giá trị trọng số
        if not all(0 <= attr.weight <= 4 for attr in attributes):
            raise HTTPException(
                status_code=400,
                detail="Trọng số phải nằm trong khoảng 0-4"
            )
        
        # Lấy danh sách tour từ database
        tours = get_tours_from_db()
        if not tours:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy tour nào trong database"
            )
        
        # Khởi tạo hệ thống gợi ý với connection pool
        recommender = TourRecommendation(connection_pool)
        
        # Lấy kết quả gợi ý
        recommendations = recommender.recommend_tours(tours, user_input, priorities)
        
        # Chuyển đổi kết quả thành định dạng response
        response = []
        for tour, score in recommendations[:5]:  # Chỉ lấy top 5
            tour_response = TourResponse(
                id=tour['id'],
                ten=tour['ten'],
                gia=tour['gia'],
                loai_hinh=tour['loai_hinh'],
                am_thuc=tour['am_thuc'],
                phuong_tien=tour['phuong_tien'],
                so_ngay=tour['so_ngay'],
                mo_ta=tour['mo_ta'],
                url=tour['url'],
                topsis_score=float(score)
            )
            response.append(tour_response)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý yêu cầu: {str(e)}")

def main():
    """Hàm main để chạy FastAPI server"""
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main() 