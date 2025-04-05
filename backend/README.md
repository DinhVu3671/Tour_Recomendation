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

### Endpoint: POST /v1.0/api/recommendation_tour

Gợi ý tour dựa trên sở thích và yêu cầu của người dùng.

#### Request Body

```json
{
    "attributes": [
        {
            "attribute": "gia",
            "weight": 4
        },
        {
            "attribute": "loai_hinh",
            "weight": 3
        },
        {
            "attribute": "am_thuc",
            "weight": 2
        },
        {
            "attribute": "phuong_tien",
            "weight": 1
        },
        {
            "attribute": "so_ngay",
            "weight": 3
        }
    ],
    "user_input": {
        "gia": 5000000,
        "so_ngay": 3,
        "loai_hinh": 1,
        "am_thuc": 2,
        "phuong_tien": 1
    }
}
```

#### Parameters

- `attributes`: Danh sách các thuộc tính và trọng số tương ứng
  - `attribute`: Tên thuộc tính (gia, loai_hinh, am_thuc, phuong_tien, so_ngay)
  - `weight`: Trọng số (0-4)
  
- `user_input`: Thông tin sở thích của người dùng
  - `gia`: Giá mong muốn (VND)
  - `so_ngay`: Số ngày mong muốn
  - `loai_hinh`: ID loại hình tour (1: Nghỉ dưỡng, 2: Biển, 3: Thám hiểm, 4: Núi)
  - `am_thuc`: ID ẩm thực (1: Chua, 2: Cay, 3: Mặn, 4: Ngọt)
  - `phuong_tien`: ID phương tiện (1: Ô tô, 2: Máy bay, 3: Tàu hỏa, 4: Thuyền)

#### Response

```json
[
    {
        "id": 1,
        "ten": "Tour Biển Nha Trang",
        "gia": 5000000.0,
        "loai_hinh": 1,
        "am_thuc": 2,
        "phuong_tien": 3,
        "so_ngay": 4,
        "mo_ta": "Tour tham quan biển Nha Trang...",
        "url": "https://example.com/tour1.jpg",
        "topsis_score": 0.85
    },
    // ... 4 tour khác
]
```

#### Response Fields

- `id`: ID của tour
- `ten`: Tên tour
- `gia`: Giá tour (VND)
- `loai_hinh`: ID loại hình tour
- `am_thuc`: ID ẩm thực
- `phuong_tien`: ID phương tiện
- `so_ngay`: Số ngày
- `mo_ta`: Mô tả tour
- `url`: URL hình ảnh tour
- `topsis_score`: Điểm TOPSIS (0-1)

#### Error Responses

- 400 Bad Request: Dữ liệu đầu vào không hợp lệ
- 404 Not Found: Không tìm thấy tour nào
- 500 Internal Server Error: Lỗi server

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