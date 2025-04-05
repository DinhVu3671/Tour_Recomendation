# Hệ Thống Gợi Ý Tour Du Lịch

Hệ thống gợi ý tour du lịch sử dụng thuật toán TOPSIS để đề xuất các tour phù hợp với sở thích và yêu cầu của người dùng.

## Yêu Cầu Hệ Thống

- Python 3.8 trở lên
- PostgreSQL
- pip (Python package manager)

## Cài Đặt

1. Clone repository:
```bash
git clone <repository_url>
cd <repository_directory>
```

2. Tạo và kích hoạt môi trường ảo (tùy chọn nhưng khuyến nghị):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. Cài đặt các thư viện cần thiết:
```bash
pip install -r requirements.txt
```

4. Tạo file `.env` trong thư mục gốc với nội dung:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
```

## Chạy Ứng Dụng

1. Khởi động server:
```bash
python main.py
```

2. Server sẽ chạy tại địa chỉ: `http://localhost:8000`

3. Truy cập tài liệu API:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Documentation

### Tour Recommendation API

**Endpoint:** `POST /v1.0/api/recommendation_tour`

**Description:** Gợi ý tour dựa trên các thuộc tính và mức độ ưu tiên của người dùng.

**Request Body:**
```json
{
    "attributes": [
        {
            "name": "gia",
            "value": 5000000,
            "weight": 4
        },
        {
            "name": "loai_hinh",
            "value": 1,
            "weight": 3
        },
        {
            "name": "am_thuc",
            "value": 2,
            "weight": 2
        },
        {
            "name": "phuong_tien",
            "value": 1,
            "weight": 1
        },
        {
            "name": "so_ngay",
            "value": 3,
            "weight": 4
        }
    ]
}
```

**Parameters:**
- `attributes`: Danh sách các thuộc tính và mức độ ưu tiên
  - `name`: Tên thuộc tính (gia, loai_hinh, am_thuc, phuong_tien, so_ngay)
  - `value`: Giá trị mong muốn cho thuộc tính
  - `weight`: Mức độ ưu tiên (0-4)

**Response:**
```json
{
    "recommendations": [
        {
            "id": 1,
            "name": "Tour Hạ Long 3 ngày 2 đêm",
            "price": 4500000,
            "type": 1,
            "cuisine": 2,
            "transportation": 1,
            "duration": 3,
            "description": "Tour tham quan vịnh Hạ Long...",
            "url": "https://example.com/tour1",
            "topsis_score": 0.85
        },
        // ... các tour khác
    ]
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `404 Not Found`: Không tìm thấy tour nào
- `500 Internal Server Error`: Lỗi server

**Example Request:**
```bash
curl -X POST "http://localhost:8000/v1.0/api/recommendation_tour" \
     -H "Content-Type: application/json" \
     -d '{
           "attributes": [
             {"name": "gia", "value": 5000000, "weight": 4},
             {"name": "loai_hinh", "value": 1, "weight": 3},
             {"name": "am_thuc", "value": 2, "weight": 2},
             {"name": "phuong_tien", "value": 1, "weight": 1},
             {"name": "so_ngay", "value": 3, "weight": 4}
           ]
         }'
```

## Cấu Trúc Dự Án

```
.
├── main.py                 # File chính chứa FastAPI endpoint
├── topsis_tour_recommendation.py  # Class xử lý thuật toán TOPSIS
├── database_config.py      # Cấu hình kết nối database
├── requirements.txt        # Danh sách thư viện cần thiết
├── .env                   # File chứa biến môi trường
└── README.md              # Tài liệu hướng dẫn
```

## Thuật Toán TOPSIS

Hệ thống sử dụng thuật toán TOPSIS để xếp hạng các tour dựa trên:
1. Khoảng cách giữa giá và số ngày của tour với giá trị mong muốn
2. Độ tương quan giữa loại hình tour, ẩm thực và phương tiện với sở thích người dùng
3. Trọng số của từng thuộc tính do người dùng cung cấp

## Lưu Ý

- Đảm bảo database PostgreSQL đã được cài đặt và chạy
- Kiểm tra kết nối database trong file `.env`
- Các trọng số phải nằm trong khoảng 0-4
- Phải cung cấp đầy đủ thông tin trong `user_input` 