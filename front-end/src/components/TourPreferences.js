import React, { useState } from 'react';
import { 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Chip
} from '@mui/material';

const TourPreferences = ({ onPreferencesChange }) => {
  const [formData, setFormData] = useState({
    gia: '',
    loai_hinh: '',
    am_thuc: '',
    phuong_tien: '',
    so_ngay: '',
    gia_priority: '',
    loai_hinh_priority: '',
    am_thuc_priority: '',
    phuong_tien_priority: '',
    so_ngay_priority: ''
  });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const tourTypes = [
    { value: 1, label: 'Du lịch biển' },
    { value: 2, label: 'Du lịch nghỉ dưỡng' },
    { value: 3, label: 'Du lịch núi' },
    { value: 4, label: 'Du lịch thám hiểm hiểm' },
  ];

  const cuisines = [
    { value: 1, label: 'Ẩm thực vị chua' },
    { value: 2, label: 'Ẩm thực vị ngọt' },
    { value: 3, label: 'Ẩm thực vị cay' },
    { value: 4, label: 'Ẩm thực vị mặn' }
  ];

  const transportation = [
    { value: 1, label: 'Máy bay' },
    { value: 2, label: 'Tàu hỏa' },
    { value: 3, label: 'Ô tô' },
    { value: 4, label: 'Tàu thủy' },
  ];

  const days = [
    { value: 1, label: '1-2 ngày' },
    { value: 2, label: '3-4 ngày' },
    { value: 3, label: '5-7 ngày' },
    { value: 4, label: '8-10 ngày' },
    { value: 5, label: 'Trên 10 ngày' }
  ];

  const priorityOptions = [
    { value: 1, label: 'Rất thấp' },
    { value: 2, label: 'Thấp' },
    { value: 3, label: 'Trung bình' },
    { value: 4, label: 'Cao' },
    { value: 5, label: 'Rất cao' }
  ];

  const attributeNames = [
    'Giá (VNĐ)',
    'Loại hình du lịch',
    'Ẩm thực',
    'Phương tiện',
    'Số ngày tour'
  ];

  const mockResponse = [
    {
      id: 1,
      ten: "Tour Đà Lạt 3 Ngày 2 Đêm",
      mo_ta: "Khám phá thành phố ngàn hoa với các điểm đến nổi tiếng như Hồ Xuân Hương, Nhà thờ Con Gà, Thung lũng Tình Yêu...",
      gia: 3500000,
      loai_hinh: 3,
      am_thuc: 2,
      phuong_tien: 3,
      so_ngay: 2,
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      topsis_score: 0.85
    },
    {
      id: 2,
      ten: "Tour Nha Trang 4 Ngày 3 Đêm",
      mo_ta: "Tận hưởng kỳ nghỉ biển tuyệt vời tại Nha Trang với các hoạt động lặn biển, tắm bùn, tham quan đảo...",
      gia: 4500000,
      loai_hinh: 1,
      am_thuc: 1,
      phuong_tien: 1,
      so_ngay: 2,
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      topsis_score: 0.92
    },
    {
      id: 3,
      ten: "Tour Sapa 5 Ngày 4 Đêm",
      mo_ta: "Khám phá vẻ đẹp của Sapa với ruộng bậc thang, đỉnh Fansipan, thác Bạc và các bản làng dân tộc...",
      gia: 5500000,
      loai_hinh: 3,
      am_thuc: 3,
      phuong_tien: 2,
      so_ngay: 3,
      url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      topsis_score: 0.78
    }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (onPreferencesChange) {
      onPreferencesChange(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSuggestTour = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data instead of API call
      setRecommendations(mockResponse);
      
    } catch (error) {
      console.error('Error suggesting tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTourTypeLabel = (value) => {
    return tourTypes.find(type => type.value === value)?.label || '';
  };

  const getCuisineLabel = (value) => {
    return cuisines.find(cuisine => cuisine.value === value)?.label || '';
  };

  const getTransportationLabel = (value) => {
    return transportation.find(trans => trans.value === value)?.label || '';
  };

  const getDaysLabel = (value) => {
    return days.find(day => day.value === value)?.label || '';
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Grid container spacing={2}>
        {/* Cột bên trái: Tên thuộc tính và Độ ưu tiên */}
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '56px',
            //   bgcolor: 'primary.main',
              color: 'black',
              borderRadius: 1
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Thuộc tính
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '56px',
            //   bgcolor: 'primary.main',
              color: 'black',
              borderRadius: 1
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Độ ưu tiên
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Cột bên phải: Form fields */}
        <Grid item xs={12} sm={10}>
          <Grid container spacing={2}>
            {/* Hàng 1: Input fields */}
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Giá (VNĐ)
                </Typography>
                <TextField
                  fullWidth
                  name="gia"
                  type="number"
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Loại hình du lịch
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    name="loai_hinh"
                    onChange={handleChange}
                  >
                    {tourTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Ẩm thực
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    name="am_thuc"
                    onChange={handleChange}
                  >
                    {cuisines.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Phương tiện di chuyển
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    name="phuong_tien"
                    onChange={handleChange}
                  >
                    {transportation.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Số ngày tour
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    name="so_ngay"
                    onChange={handleChange}
                  >
                    {days.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Hàng 2: Priority selectors */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth required>
                <InputLabel>Mức độ ưu tiên giá</InputLabel>
                <Select
                  name="gia_priority"
                  label="Mức độ ưu tiên giá"
                  onChange={handleChange}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth required>
                <InputLabel>Mức độ ưu tiên loại hình</InputLabel>
                <Select
                  name="loai_hinh_priority"
                  label="Mức độ ưu tiên loại hình"
                  onChange={handleChange}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth required>
                <InputLabel>Mức độ ưu tiên ẩm thực</InputLabel>
                <Select
                  name="am_thuc_priority"
                  label="Mức độ ưu tiên ẩm thực"
                  onChange={handleChange}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth required>
                <InputLabel>Mức độ ưu tiên phương tiện</InputLabel>
                <Select
                  name="phuong_tien_priority"
                  label="Mức độ ưu tiên phương tiện"
                  onChange={handleChange}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth required>
                <InputLabel>Mức độ ưu tiên số ngày</InputLabel>
                <Select
                  name="so_ngay_priority"
                  label="Mức độ ưu tiên số ngày"
                  onChange={handleChange}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Button container */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        mt: 3,
        mb: 2
      }}>
        <Button
          variant="contained"
          onClick={handleSuggestTour}
          disabled={loading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            minWidth: '150px',
            height: '40px',
            position: 'relative'
          }}
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                color: 'white',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          ) : (
            'Gợi ý tour'
          )}
        </Button>
      </Box>

      {/* Recommendations section */}
      {recommendations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Danh sách tour được gợi ý
          </Typography>
          <Grid container spacing={3}>
            {recommendations.map((tour, index) => (
              <Grid item xs={12} md={6} key={tour.id}>
                <Card sx={{ display: 'flex', height: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 200 }}
                    image={tour.url || 'https://via.placeholder.com/200x150'}
                    alt={tour.ten}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {tour.ten}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {tour.mo_ta}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                        {tour.gia.toLocaleString()} VNĐ
                      </Typography>
                      <Rating value={tour.topsis_score * 5} readOnly precision={0.5} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={getTourTypeLabel(tour.loai_hinh)} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={getCuisineLabel(tour.am_thuc)} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={getTransportationLabel(tour.phuong_tien)} 
                        size="small" 
                        color="info" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={getDaysLabel(tour.so_ngay)} 
                        size="small" 
                        color="success" 
                        variant="outlined" 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default TourPreferences; 