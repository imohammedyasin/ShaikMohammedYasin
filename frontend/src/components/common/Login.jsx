import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axiosInstance from './AxiosInstance';
import NavBar from './NavBar';
import { Container } from '@mui/material';

const Login = () => {
   const navigate = useNavigate()
   const [data, setData] = useState({
      email: "",
      password: "",
   })
   const [loading, setLoading] = useState(false)
   const [errors, setErrors] = useState({})

   const validateEmail = (email) => {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      return gmailRegex.test(email);
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
      
      if (errors[name]) {
         setErrors({ ...errors, [name]: '' });
      }
      
      if (name === 'email' && value) {
         if (!validateEmail(value)) {
            setErrors({ ...errors, email: 'Only Gmail addresses are allowed (@gmail.com)' });
         } else {
            setErrors({ ...errors, email: '' });
         }
      }
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);

      const newErrors = {};
      
      if (!data?.email?.trim()) {
         newErrors.email = 'Email is required';
      } else if (!validateEmail(data.email)) {
         newErrors.email = 'Only Gmail addresses are allowed (@gmail.com)';
      }
      
      if (!data?.password?.trim()) {
         newErrors.password = 'Password is required';
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
         setLoading(false);
         return;
      }

      axiosInstance.post('/api/user/login', data)
         .then((res) => {
            if (res.data.success) {
               localStorage.setItem("token", res.data.token);
               localStorage.setItem("user", JSON.stringify(res.data.userData));
               if (typeof window.setUserData === 'function' && typeof window.setUserLoggedIn === 'function') {
                  window.setUserData(res.data.userData);
                  window.setUserLoggedIn(true);
               }
               navigate('/dashboard')
            } else {
               alert(res.data.message)
            }
         })
         .catch((err) => {
            if (err.response && err.response.status === 401) {
               alert("User doesn't exist");
            } else {
               alert("Login failed. Please try again.");
            }
            navigate("/login");
         })
         .finally(() => {
            setLoading(false);
         });
   };

   return (
      <>
         <NavBar />
         <Box
            sx={{
               minHeight: '100vh',
               background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               py: 4,
               px: 2,
            }}
         >
            <Container maxWidth="sm">
               <Box
                  sx={{
                     width: '100%',
                     maxWidth: 450,
                     mx: 'auto',
                     p: 4,
                     borderRadius: 3,
                     background: '#FFFFFF',
                     boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                     border: '1px solid #F3F4F6',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                  }}
               >
                  <Avatar 
                     sx={{ 
                        bgcolor: '#2563EB', 
                        color: '#FFFFFF', 
                        width: 64, 
                        height: 64, 
                        mb: 3,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                     }}
                  >
                     <LockOutlinedIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  
                  <Typography 
                     component="h1" 
                     variant="h3" 
                     sx={{ 
                        color: '#111827', 
                        fontWeight: 800, 
                        mb: 2, 
                        textAlign: 'center',
                        fontFamily: 'Poppins, Inter, sans-serif',
                     }}
                  >
                     Welcome Back
                  </Typography>
                  
                  <Typography 
                     variant="body1" 
                     sx={{ 
                        color: '#6B7280', 
                        mb: 4, 
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                     }}
                  >
                     Sign in to continue your learning journey on <Box component="span" sx={{ color: '#2563EB', fontWeight: 600 }}>LearnHub</Box>
                  </Typography>
                  
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email}
                        placeholder="Enter your email"
                        sx={{
                           mb: 3,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              fontSize: '1rem',
                              '& fieldset': {
                                 borderColor: errors.email ? '#EF4444' : '#E5E7EB',
                                 borderWidth: 2,
                              },
                              '&:hover fieldset': {
                                 borderColor: errors.email ? '#EF4444' : '#2563EB',
                              },
                              '&.Mui-focused fieldset': {
                                 borderColor: errors.email ? '#EF4444' : '#2563EB',
                                 borderWidth: 2,
                                 boxShadow: errors.email ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(37, 99, 235, 0.1)',
                              },
                           },
                           '& .MuiInputLabel-root': {
                              color: errors.email ? '#EF4444' : '#6B7280',
                              fontWeight: 500,
                              '&.Mui-focused': {
                                 color: errors.email ? '#EF4444' : '#2563EB',
                              },
                           },
                           '& .MuiFormHelperText-root': {
                              color: '#EF4444',
                              fontSize: '0.75rem',
                              marginLeft: 0,
                           },
                        }}
                     />
                     
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        variant="outlined"
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{
                           mb: 4,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              fontSize: '1rem',
                              '& fieldset': {
                                 borderColor: errors.password ? '#EF4444' : '#E5E7EB',
                                 borderWidth: 2,
                              },
                              '&:hover fieldset': {
                                 borderColor: errors.password ? '#EF4444' : '#2563EB',
                              },
                              '&.Mui-focused fieldset': {
                                 borderColor: errors.password ? '#EF4444' : '#2563EB',
                                 borderWidth: 2,
                                 boxShadow: errors.password ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(37, 99, 235, 0.1)',
                              },
                           },
                           '& .MuiInputLabel-root': {
                              color: errors.password ? '#EF4444' : '#6B7280',
                              fontWeight: 500,
                              '&.Mui-focused': {
                                 color: errors.password ? '#EF4444' : '#2563EB',
                              },
                           },
                           '& .MuiFormHelperText-root': {
                              color: '#EF4444',
                              fontSize: '0.75rem',
                              marginLeft: 0,
                           },
                        }}
                     />
                     
                     <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                           mb: 3,
                           bgcolor: '#2563EB',
                           color: '#FFFFFF',
                           fontWeight: 700,
                           padding: '16px 32px',
                           borderRadius: '9999px',
                           textTransform: 'none',
                           fontSize: '1.1rem',
                           boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.4)',
                           transition: 'all 0.2s ease',
                           '&:hover': {
                              bgcolor: '#1749B1',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.5)',
                           },
                           '&:disabled': {
                              bgcolor: '#9CA3AF',
                              transform: 'none',
                              boxShadow: 'none',
                           },
                        }}
                     >
                        {loading ? 'Signing In...' : 'Sign In'}
                     </Button>
                     
                     <Grid container justifyContent="center">
                        <Grid item>
                           <Typography 
                              variant="body1" 
                              sx={{ 
                                 color: '#6B7280',
                                 textAlign: 'center',
                                 fontSize: '1rem',
                              }}
                           >
                              Don't have an account?{' '}
                              <Link 
                                 to={'/register'} 
                                 style={{ 
                                    color: '#2563EB', 
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    transition: 'color 0.2s ease',
                                 }}
                                 onMouseEnter={(e) => e.target.style.color = '#1749B1'}
                                 onMouseLeave={(e) => e.target.style.color = '#2563EB'}
                              >
                                 Sign Up
                              </Link>
                           </Typography>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Container>
         </Box>
      </>
   )
}

export default Login



