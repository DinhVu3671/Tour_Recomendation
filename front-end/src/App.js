import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import { Container, Typography, Paper, Box } from '@mui/material';
import TourPreferences from './components/TourPreferences';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
      {/* <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Hệ Thống Gợi Ý Tour Du Lịch
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông Tin Ưu Tiên
            </Typography>
            <TourPreferences />
          </Paper>
        </Container>
      </Box> */}
    </Router>
  );
}

export default App;
