import React, { useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from '../../App';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Button as MuiButton } from '@mui/material';

const NavBar = ({ setSelectedComponent, onDashboardClick, onOptionClick }) => {
   const user = useContext(UserContext)
   const [anchorEl, setAnchorEl] = React.useState(null);
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const currentTab = searchParams.get('tab');

   const handleOptionClick = useCallback((option) => {
      if (setSelectedComponent) setSelectedComponent(option);
      if (onOptionClick) onOptionClick(option);
      navigate(`/dashboard?tab=${option}`);
   }, [setSelectedComponent, onOptionClick, navigate]);

   const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
   };
   
   const handleClose = () => {
      setAnchorEl(null);
   };

   // Check if we're in the enrolled courses section
   const isInEnrolledCourses = currentTab === 'enrolledcourses';

   if (!user || !user.userData) {
      return (
         <AppBar position="sticky" elevation={0} sx={{
            background: '#FFFFFF',
            color: '#111827',
            borderBottom: '1px solid #F3F4F6',
            minHeight: 72,
            fontFamily: 'Inter, sans-serif',
            zIndex: 1201,
         }}>
            <Toolbar sx={{ 
               minHeight: 72, 
               fontFamily: 'Inter, sans-serif', 
               px: { xs: 2, md: 6 }, 
               display: 'flex', 
               alignItems: 'center' 
            }}>
               <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  cursor: 'pointer', 
                  pr: 3, 
                  transition: 'transform 0.2s', 
                  '&:hover': { transform: 'scale(1.02)' } 
               }} onClick={() => navigate('/')}>
                  <Box sx={{ width: 32, height: 32, overflow: 'hidden', mr: 1 }}>
                     <svg 
                        width="100%" 
                        height="100%" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
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
               
               <Box sx={{ flex: 1 }} />
               
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MuiButton
                     variant="text"
                     color="inherit"
                     size="small"
                     sx={{ 
                        fontWeight: 600, 
                        textTransform: 'none', 
                        color: '#6B7280',
                        borderRadius: '9999px',
                        px: 3,
                        py: 1,
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                           color: '#2563EB',
                           background: 'rgba(37, 99, 235, 0.05)',
                        } 
                     }}
                     onClick={() => navigate('/login')}
                  >
                     Sign In
                  </MuiButton>
                  <MuiButton
                     variant="contained"
                     size="small"
                     sx={{ 
                        borderRadius: '9999px', 
                        fontWeight: 700, 
                        textTransform: 'none', 
                        background: '#2563EB',
                        color: '#FFFFFF',
                        px: 3,
                        py: 1,
                        fontSize: '14px',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                           background: '#1749B1',
                           transform: 'translateY(-1px)',
                           boxShadow: '0 6px 12px -2px rgba(37, 99, 235, 0.3)'
                        },
                     }}
                     onClick={() => navigate('/register')}
                  >
                     Sign Up
                  </MuiButton>
               </Box>
            </Toolbar>
         </AppBar>
      );
   }

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (user.setUserData) user.setUserData(undefined);
      if (user.setUserLoggedIn) user.setUserLoggedIn(false);
      window.location.href = "/";
   }

   return (
      <AppBar position="sticky" elevation={0} sx={{
         background: '#FFFFFF',
         color: '#111827',
         borderBottom: '1px solid #F3F4F6',
         minHeight: 72,
         fontFamily: 'Inter, sans-serif',
         zIndex: 1201,
      }}>
         <Toolbar sx={{ 
            minHeight: 72, 
            fontFamily: 'Inter, sans-serif', 
            px: { xs: 2, md: 6 }, 
            display: 'flex', 
            alignItems: 'center' 
         }}>
            {/* Left: Logo */}
            <Box sx={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: 1, 
               cursor: 'pointer', 
               pr: 3, 
               transition: 'transform 0.2s', 
               '&:hover': { transform: 'scale(1.02)' } 
            }} onClick={() => (user && user.userData ? navigate('/dashboard') : navigate('/'))}>
               <Box sx={{ width: 32, height: 32, overflow: 'hidden', mr: 1 }}>
                  <svg 
                     width="100%" 
                     height="100%" 
                     viewBox="0 0 24 24" 
                     fill="none" 
                     xmlns="http://www.w3.org/2000/svg"
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
            
            <Box sx={{ flex: 1 }} />
            
            {/* Center: Navigation */}
            <Box sx={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: 1, 
               bgcolor: '#F8FAFC', 
               px: 2, 
               py: 1, 
               borderRadius: 2, 
               border: '1px solid #E5E7EB'
            }}>
               <Tooltip title="Dashboard">
                  <IconButton 
                     onClick={onDashboardClick ? onDashboardClick : () => navigate('/dashboard')} 
                     sx={{ 
                        borderRadius: 1.5, 
                        transition: 'all 0.2s ease', 
                        '&:hover': { 
                           bgcolor: '#2563EB',
                           color: '#FFFFFF'
                        } 
                     }}
                  >
                     <DashboardIcon sx={{ color: '#6B7280' }} />
                  </IconButton>
               </Tooltip>
               
               {!isInEnrolledCourses && (
                  <>
                     {user.userData.type === 'Teacher' && (
                     <Tooltip title="Add Course">
                        <IconButton 
                           onClick={() => handleOptionClick('addcourse')} 
                           sx={{ 
                              borderRadius: 1.5, 
                              transition: 'all 0.2s ease', 
                              '&:hover': { 
                                 bgcolor: '#2563EB',
                                 color: '#FFFFFF'
                              } 
                           }}
                        >
                           <AddCircleOutlineIcon sx={{ color: '#6B7280' }} />
                        </IconButton>
                     </Tooltip>
                  )}
                  
                     {user.userData.type === 'Admin' && (
                     <Tooltip title="All Courses">
                        <IconButton 
                           onClick={() => handleOptionClick('courses')} 
                           sx={{ 
                              borderRadius: 1.5, 
                              transition: 'all 0.2s ease', 
                              '&:hover': { 
                                 bgcolor: '#2563EB',
                                 color: '#FFFFFF'
                              } 
                           }}
                        >
                           <SchoolIcon sx={{ color: '#6B7280' }} />
                        </IconButton>
                     </Tooltip>
                  )}
                  </>
               )}
               
               {user.userData.type === 'Student' && (
               <Tooltip title="My Courses">
                  <IconButton 
                     onClick={() => handleOptionClick('enrolledcourses')} 
                     sx={{ 
                        borderRadius: 1.5, 
                        transition: 'all 0.2s ease', 
                        '&:hover': { 
                           bgcolor: '#2563EB',
                           color: '#FFFFFF'
                        } 
                     }}
                  >
                     <BookIcon sx={{ color: '#6B7280' }} />
                  </IconButton>
               </Tooltip>
            )}
            </Box>
            
            {/* Right: User Profile */}
            <Box sx={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: 2, 
               ml: 3,
               bgcolor: '#F8FAFC',
               px: 3,
               py: 1.5,
               borderRadius: 2,
               border: '1px solid #E5E7EB'
            }}>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography sx={{ 
                     color: '#111827', 
                     fontWeight: 600, 
                     fontSize: '14px', 
                     lineHeight: 1 
                  }}>
                     {user.userData.name}
                  </Typography>
                  <Typography sx={{ 
                     color: '#6B7280', 
                     fontWeight: 500, 
                     fontSize: '12px', 
                     textTransform: 'capitalize' 
                  }}>
                     {user.userData.type}
                  </Typography>
               </Box>
               
               <IconButton 
                  onClick={handleMenu} 
                  sx={{ 
                     p: 0, 
                     border: '2px solid #2563EB', 
                     bgcolor: '#FFFFFF',
                     borderRadius: '50%',
                     width: 36,
                     height: 36,
                     '&:hover': {
                        bgcolor: '#2563EB',
                        color: '#FFFFFF'
                     }
                  }}
               >
                  <Avatar sx={{ 
                     bgcolor: '#2563EB', 
                     color: '#FFFFFF',
                     width: 32,
                     height: 32,
                     fontSize: '14px'
                  }}>
                     <PersonIcon sx={{ fontSize: '16px' }} />
                  </Avatar>
               </IconButton>
               
               <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ 
                     sx: { 
                        mt: 1, 
                        minWidth: 160, 
                        borderRadius: 2, 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #F3F4F6'
                     } 
                  }}
               >
                  <MenuItem 
                     onClick={handleLogout} 
                     sx={{ 
                        color: '#EF4444', 
                        fontWeight: 600, 
                        fontSize: '14px',
                        '&:hover': {
                           bgcolor: '#FEF2F2'
                        }
                     }}
                  >
                     <LogoutIcon sx={{ mr: 1, fontSize: '18px' }} /> Log Out
                  </MenuItem>
               </Menu>
            </Box>
         </Toolbar>
      </AppBar>
   )
}

export default NavBar

