import React, { useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import TourPreferences from '../components/TourPreferences';

function Home() {
  const [preferences, setPreferences] = useState({});

  const handlePreferencesChange = (newPreferences) => {
    setPreferences(newPreferences);
    console.log('Form values changed:', newPreferences);
    // Here you can handle the form values, e.g., send them to your backend
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Hệ Thống Gợi Ý Tour Du Lịch
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          {/* <Typography variant="h6" gutterBottom>
            Thông Tin Ưu Tiên
          </Typography> */}
          <TourPreferences onPreferencesChange={handlePreferencesChange} />
        </Paper>
      </Container>
    </Box>
  );
}

export default Home; 