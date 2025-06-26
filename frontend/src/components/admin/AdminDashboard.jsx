import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Typography, 
  Paper, 
  Button,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Analytics as AnalyticsIcon,
  Announcement as AnnouncementIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import UserList from './UserList';
import CourseList from './CourseList';
import Analytics from './Analytics';
import Announcements from './Announcements';
import Settings from './Settings';

const sections = [
  { name: 'Users', icon: <PeopleIcon /> },
  { name: 'Courses', icon: <SchoolIcon /> },
  { name: 'Analytics', icon: <AnalyticsIcon /> },
  { name: 'Announcements', icon: <AnnouncementIcon /> },
  { name: 'Settings', icon: <SettingsIcon /> },
];

const AdminDashboard = () => {
  const [selected, setSelected] = useState('Users');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#FFFFFF' }}>
      <Drawer 
        variant="permanent" 
        sx={{ 
          width: 280, 
          flexShrink: 0, 
          [`& .MuiDrawer-paper`]: { 
            width: 280, 
            boxSizing: 'border-box', 
            background: '#F8FAFC',
            borderRight: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          } 
        }}
      >
        <Toolbar sx={{ 
          minHeight: 80, 
          display: 'flex', 
          alignItems: 'center', 
          px: 3,
          borderBottom: '1px solid #E5E7EB'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 32, 
              height: 32, 
              overflow: 'hidden', 
              mr: 1
            }}>
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
            <Typography variant="h6" sx={{ 
              color: '#2563EB', 
              fontWeight: 800, 
              fontFamily: 'Poppins, Inter, sans-serif',
              letterSpacing: '-0.025em'
            }}>
              LearnHub Admin
            </Typography>
          </Box>
        </Toolbar>
        <List sx={{ pt: 2 }}>
          {sections.map((section) => (
            <ListItem 
              button 
              key={section.name} 
              selected={selected === section.name} 
              onClick={() => setSelected(section.name)}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: '#2563EB',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#1749B1',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#FFFFFF',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(37, 99, 235, 0.05)',
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: selected === section.name ? '#FFFFFF' : '#6B7280',
                minWidth: 40
              }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText 
                primary={section.name} 
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: selected === section.name ? 700 : 500,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mx: 2, my: 2 }} />
        <Box sx={{ px: 2, pb: 2 }}>
          <Button 
            fullWidth
            variant="outlined"
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={() => { 
              localStorage.removeItem('adminToken'); 
              navigate('/admin/login'); 
            }}
            sx={{
              borderRadius: 2,
              borderWidth: 2,
              fontWeight: 600,
              textTransform: 'none',
              py: 1.5,
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              borderColor: '#EF4444',
              color: '#EF4444',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.05)',
                borderColor: '#DC2626',
                color: '#DC2626',
                borderWidth: 2,
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, background: '#FFFFFF' }}>
        <AppBar 
          position="static" 
          elevation={0} 
          sx={{ 
            mb: 3, 
            background: '#FFFFFF',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          <Toolbar sx={{ minHeight: 80, px: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                flexGrow: 1, 
                color: '#111827',
                fontWeight: 800,
                fontFamily: 'Poppins, Inter, sans-serif'
              }}
            >
              {selected}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ px: 4, pb: 4 }}>
          <Paper sx={{ 
            p: 4, 
            minHeight: 400, 
            borderRadius: 3,
            background: '#FFFFFF',
            border: '1px solid #F3F4F6',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
          {selected === 'Users' && <UserList />}
          {selected === 'Courses' && <CourseList />}
          {selected === 'Analytics' && <Analytics />}
          {selected === 'Announcements' && <Announcements />}
          {selected === 'Settings' && <Settings />}
          {selected !== 'Users' && selected !== 'Courses' && selected !== 'Analytics' && selected !== 'Announcements' && selected !== 'Settings' && (
              <Typography color="#6B7280" sx={{ fontFamily: 'Inter, sans-serif' }}>
                (Placeholder for {selected} management UI)
              </Typography>
          )}
        </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 