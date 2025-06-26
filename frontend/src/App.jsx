import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import CoffeeIcon from '@mui/icons-material/LocalCafe';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Button, Box, Avatar, Tooltip, Typography } from '@mui/material';
import { LinkedIn as LinkedInIcon, GitHub as GitHubIcon } from '@mui/icons-material';

import "./App.css";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import Dashboard from "./components/common/Dashboard";
import CourseContent from "./components/user/student/CourseContent";
import CourseAnalytics from "./components/user/teacher/CourseAnalytics";
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

export const UserContext = createContext();

const DEVELOPER_PFP = "/yasin.jpg";

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        const userData = JSON.parse(user);
        setUserData(userData);
        setUserLoggedIn(true);
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    getData();
    window.setUserData = setUserData;
    window.setUserLoggedIn = setUserLoggedIn;
  }, []);

  return (
    <UserContext.Provider value={{ userData, userLoggedIn, setUserData, setUserLoggedIn }}>
      <div className="App">
        <Router>
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* <Route path="/about" element={<About />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
              <Route path="/courseSection/:courseId/:courseTitle" element={<CourseContent />} />
              <Route path="/course-analytics/:courseId" element={<CourseAnalytics />} />
              {userLoggedIn ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                </>
              ) : (
                <Route path="/login" element={<Login />} />
              )}
            </Routes>
          </div>
          <footer className="footer-premium">
            <Box sx={{
              maxWidth: '1200px',
              margin: '0 auto',
              px: { xs: 2, md: 4 },
              py: 6
            }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 4,
                mb: 4
              }}>
                {/* Brand Section */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ 
                      width: 32, 
                      height: 32, 
                      overflow: 'hidden', 
                      mr: 1
                    }}>
                      <img 
                        src="https://media.licdn.com/dms/image/D4D03AQHhKqXqXqXqXq/profile-displayphoto-shrink_800_800/0/1700000000000?e=1700000000&v=beta&t=YOUR_ACTUAL_IMAGE_ID" 
                        alt="LearnHub Logo"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <svg 
                        width="100%" 
                        height="100%" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'none' }}
                      >
                        <path 
                          d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z" 
                          fill="#2563EB"
                        />
                      </svg>
                    </Box>
                    <Typography variant="h5" sx={{ 
                      color: '#2563EB', 
                      fontWeight: 800, 
                      fontFamily: 'Poppins, Inter, sans-serif',
                      letterSpacing: '-0.025em'
                    }}>
                      LearnHub
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    color: '#6B7280', 
                    mb: 3,
                    lineHeight: 1.6,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Empowering learners worldwide with premium educational content. 
                    Join our community and unlock your potential with expert-led courses.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="LinkedIn Profile" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LinkedInIcon />}
                        href="https://www.linkedin.com/in/shaik-mohammed-yasin-a45743328/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          borderRadius: '9999px',
                          borderColor: '#2563EB',
                          color: '#2563EB',
                          fontSize: '0.75rem',
                          px: 2,
                          py: 0.5,
                          '&:hover': {
                            borderColor: '#1749B1',
                            bgcolor: 'rgba(37, 99, 235, 0.05)'
                          }
                        }}
                      >
                        LinkedIn
                      </Button>
                    </Tooltip>
                    <Tooltip title="GitHub Profile" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<GitHubIcon />}
                        href="https://github.com/imohammedyasin"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          borderRadius: '9999px',
                          borderColor: '#6B7280',
                          color: '#6B7280',
                          fontSize: '0.75rem',
                          px: 2,
                          py: 0.5,
                          '&:hover': {
                            borderColor: '#374151',
                            bgcolor: 'rgba(107, 114, 128, 0.05)'
                          }
                        }}
                      >
                        GitHub
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Quick Links */}
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: '#111827', 
                    fontWeight: 700, 
                    mb: 3,
                    fontFamily: 'Poppins, Inter, sans-serif'
                  }}>
                    Quick Links
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography 
                      component="a" 
                      href="/" 
                      sx={{ 
                        color: '#6B7280', 
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: '#2563EB'
                        }
                      }}
                    >
                      Home
                    </Typography>
                    <Typography 
                      component="a" 
                      href="/login" 
                      sx={{ 
                        color: '#6B7280', 
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: '#2563EB'
                        }
                      }}
                    >
                      Sign In
                    </Typography>
                    <Typography 
                      component="a" 
                      href="/register" 
                      sx={{ 
                        color: '#6B7280', 
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: '#2563EB'
                        }
                      }}
                    >
                      Sign Up
                    </Typography>
                    <Typography 
                      component="a" 
                      href="/admin/login" 
                      sx={{ 
                        color: '#6B7280', 
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: '#2563EB'
                        }
                      }}
                    >
                      Admin Access
                    </Typography>
                  </Box>
                </Box>

                {/* Developer Info */}
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: '#111827', 
                    fontWeight: 700, 
                    mb: 3,
                    fontFamily: 'Poppins, Inter, sans-serif'
                  }}>
                    Developer
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={DEVELOPER_PFP}
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        border: '2px solid #2563EB',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                      }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ 
                        color: '#111827', 
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Shaik Mohammed Yasin
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Full Stack Developer
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    color: '#6B7280',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5
                  }}>
                    Passionate about creating innovative learning experiences. 
                    Building the future of education, one course at a time.
                  </Typography>
                </Box>
              </Box>

              {/* Bottom Section */}
              <Box sx={{
                borderTop: '1px solid #E5E7EB',
                pt: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  © {date} LearnHub. All rights reserved.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="body2" sx={{ 
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem'
                  }}>
                    Privacy Policy
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem'
                  }}>
                    Terms of Service
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem'
                  }}>
                    Contact Support
                  </Typography>
                </Box>
              </Box>
            </Box>
          </footer>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;


