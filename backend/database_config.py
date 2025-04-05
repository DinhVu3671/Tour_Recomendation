import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

# Lấy thông tin kết nối từ biến môi trường
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}

# Kiểm tra xem có đủ thông tin kết nối không
if not all(DB_CONFIG.values()):
    raise ValueError("Thiếu thông tin kết nối database trong file .env") 