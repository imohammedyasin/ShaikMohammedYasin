import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, Container } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import axiosInstance from '../common/AxiosInstance';
import NavBar from '../common/NavBar';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/api/admin/login', form);
      if (res.data.success && res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        py: 4
      }}>
        <Container maxWidth="sm">
          <Paper sx={{ 
            p: 6, 
            borderRadius: 3, 
            background: '#FFFFFF',
            border: '1px solid #F3F4F6',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563EB 0%, #1749B1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <LockIcon sx={{ fontSize: 32, color: '#FFFFFF' }} />
              </Box>
            </Box>
            
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: '#111827',
              mb: 1,
              fontFamily: 'Poppins, Inter, sans-serif'
            }}>
              Admin Login
            </Typography>
            
            <Typography variant="body1" sx={{ 
              color: '#6B7280',
              mb: 4,
              fontFamily: 'Inter, sans-serif'
            }}>
              Access the LearnHub administration panel
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ 
                mb: 3,
                borderRadius: 2,
                fontFamily: 'Inter, sans-serif'
              }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username or Email"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#E5E7EB',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#2563EB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB',
                      borderWidth: 2,
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6B7280',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif'
                  },
                }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#E5E7EB',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#2563EB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB',
                      borderWidth: 2,
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6B7280',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif'
                  },
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                disabled={loading}
                sx={{
                  bgcolor: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontFamily: 'Poppins, Inter, sans-serif',
                  fontSize: 16,
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#1749B1',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 12px -2px rgba(37, 99, 235, 0.3)'
                  },
                  '&:disabled': {
                    bgcolor: '#9CA3AF',
                    color: '#FFFFFF'
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AdminLogin; 