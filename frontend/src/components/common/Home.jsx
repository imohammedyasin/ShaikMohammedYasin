import React from 'react'
import { Link } from 'react-router-dom'
import AllCourses from './AllCourses';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Typography, Button as MuiButton, IconButton, Container } from '@mui/material';
import Announcements from './Announcements';
import NavBar from './NavBar';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';

const Home = () => {
   return (
      <Box sx={{ 
         bgcolor: '#fff', 
         minHeight: '100vh', 
         width: '100%',
         position: 'relative'
      }}>
         <NavBar />
         {/* Hero Section */}
         <Box
            sx={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               minHeight: { xs: '70vh', md: '80vh' },
               pt: { xs: 8, md: 12 },
               pb: { xs: 6, md: 10 },
               px: 2,
               position: 'relative',
               width: '100%',
               overflow: 'hidden'
            }}
         >
            <Container maxWidth="lg" sx={{ zIndex: 2 }}>
               <Typography
                  variant="h2"
                  sx={{
                     fontFamily: 'Poppins, Inter, sans-serif',
                     fontWeight: 800,
                     color: '#111827',
                     textAlign: 'center',
                     mb: 3,
                     letterSpacing: -1,
                     lineHeight: 1.1,
                     fontSize: { xs: '2.2rem', md: '3.5rem' },
                  }}
               >
                  Empower Your <Box component="span" sx={{ fontStyle: 'italic', fontFamily: 'Playfair Display, Georgia, serif', color: '#2563EB', fontWeight: 700 }}>Learning</Box> Journey
               </Typography>
               <Typography
                  variant="h5"
                  sx={{
                     fontFamily: 'Inter, Poppins, sans-serif',
                     fontWeight: 400,
                     color: '#6B7280',
                     textAlign: 'center',
                     mb: 5,
                     fontSize: { xs: '1.1rem', md: '1.5rem' },
                     maxWidth: 600,
                     mx: 'auto',
                  }}
               >
                  Unlock skills, connect with experts, and achieve your goals on <Box component="span" sx={{ color: '#2563EB', fontWeight: 700 }}>LearnHub</Box>.
               </Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
                  <MuiButton
                     component={Link}
                     to="/register"
                     sx={{
                        bgcolor: '#2563EB',
                        color: '#fff',
                        fontWeight: 700,
                        fontFamily: 'Poppins, Inter, sans-serif',
                        fontSize: 18,
                        textTransform: 'none',
                        borderRadius: '999px',
                        px: 5,
                        py: 1.7,
                        boxShadow: 'none',
                        transition: 'background 0.2s',
                        '&:hover': { bgcolor: '#1749B1' },
                     }}
                     size="large"
                  >
                     Get Started
                  </MuiButton>
                  
                     <MuiButton
                     component={Link}
                     to="/admin/login"
                     sx={{
                        bgcolor: 'transparent',
                        color: '#6B7280',
                        fontWeight: 600,
                        fontFamily: 'Poppins, Inter, sans-serif',
                        fontSize: 14,
                        textTransform: 'none',
                        borderRadius: '999px',
                        px: 3,
                        py: 1,
                        border: '1px solid #E5E7EB',
                        transition: 'all 0.2s',
                        '&:hover': { 
                           bgcolor: '#F8FAFC',
                           color: '#2563EB',
                           borderColor: '#2563EB'
                        },
                     }}
                  >
                     Admin
                     </MuiButton>
               </Box>
            </Container>
            {/* Gradient Fade at Bottom */}
            <Box
               sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: { xs: 120, md: 180 },
                  background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 80%)',
                  zIndex: 1,
               }}
            />
         </Box>
         <Announcements />

         <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
               <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ 
                     fontSize: 40, 
                     color: '#2563EB',
                     mr: 1.5
                  }} />
                  <Typography variant="h3" sx={{ 
                     color: '#111827', 
                     fontWeight: 700,
                     fontFamily: 'Poppins, Inter, sans-serif'
                  }}>
                     Trending Courses
                  </Typography>
               </Box>
               <Typography variant="h6" sx={{ 
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400
               }}>
                  Discover the most popular courses from our community
               </Typography>
            </Box>
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <AllCourses />
            </Box>
         </Container>
      </Box>
   )
}

export default Home


