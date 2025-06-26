import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axiosInstance from '../../common/AxiosInstance';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  Stack,
  Divider,
  useMediaQuery,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

// Helper to get recently viewed courses from localStorage
const getRecentCourses = (allCourses) => {
  const recentIds = JSON.parse(localStorage.getItem('recentCourses') || '[]');
  return recentIds
    .map(id => allCourses.find(c => c._id === id))
    .filter(Boolean)
    .slice(0, 3);
};

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  const addProgressAndStatus = (courses) =>
    courses.map((c) => ({
      ...c,
      progress: Math.floor(Math.random() * 100) + 1,
      status: Math.random() > 0.3 ? 'active' : 'completed',
      lastAccessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));

  const fetchCourses = async () => {
      setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/api/user/getallcoursesuser', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
         if (res.data.success) {
        const coursesWithProgress = addProgressAndStatus(res.data.data);
        setCourses(coursesWithProgress);
      } else {
        setError(res.data.message || 'Failed to fetch courses');
         }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
         setLoading(false);
      }
  };

   useEffect(() => {
    fetchCourses(); 
    
    const handleCourseUpdate = () => {
      fetchCourses();
    };
    
    window.addEventListener('courseUpdated', handleCourseUpdate);
    
    return () => {
      window.removeEventListener('courseUpdated', handleCourseUpdate);
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.C_title?.toLowerCase().includes(search.toLowerCase()) ||
                           course.C_educator?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || course.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [courses, search, status]);

  const handleCourseClick = (courseId) => {
    const recentCourses = JSON.parse(localStorage.getItem('recentCourses') || '[]');
    const updatedRecent = [courseId, ...recentCourses.filter(id => id !== courseId)].slice(0, 10);
    localStorage.setItem('recentCourses', JSON.stringify(updatedRecent));
  };

   if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}><CircularProgress aria-label="Loading enrolled courses" /></Box>;
   }
   if (error) {
      return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
   }

   return (
    <Box sx={{ mt: 2, px: { xs: 1, sm: 3 }, pb: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search courses..."
          aria-label="Search courses"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box role="group" aria-label="Filter by status" sx={{ display: 'flex', gap: 1 }}>
          {STATUS_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              color={status === opt.value ? 'primary' : 'default'}
              onClick={() => setStatus(opt.value)}
              tabIndex={0}
              aria-pressed={status === opt.value}
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Enrolled Courses Grid */}
      <Grid container spacing={3} justifyContent="center" aria-label="Enrolled courses list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Box sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                borderRadius: 4,
                border: '1px solid #E5E7EB',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                  minHeight: 320,
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  borderColor: '#2563EB',
                  '& .course-thumbnail': {
                    transform: 'scale(1.05)',
                  },
                  '& .course-overlay': {
                    opacity: 1,
                  }
                },
              }}>
                {/* Gradient Overlay on Hover */}
                <Box className="course-overlay" sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 1,
                  pointerEvents: 'none'
                }} />
                
                {/* Course Thumbnail */}
                <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                  {course.thumbnail ? (
                    <img
                      className="course-thumbnail"
                      src={course.thumbnail.startsWith('/uploads') ? `http://localhost:8000${course.thumbnail}` : `http://localhost:8000/uploads/${course.thumbnail}`}
                      alt={`Thumbnail for ${course.C_title}`}
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-course-thumb.png';
                      }}
                    />
                  ) : (
                    <Box sx={{ 
                      width: '100%',
                      height: '160px',
                      background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                        animation: 'shimmer 2s infinite',
                      }
                    }}>
                      <SchoolIcon sx={{ 
                        fontSize: 60, 
                        color: '#9CA3AF',
                        zIndex: 1,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }} />
                    </Box>
                  )}
                  
                  {/* Status Badge */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: course.status === 'completed' 
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 2
                  }}>
                    {course.status === 'completed' ? 'Completed' : 'Active'}
                  </Box>
                  
                  {/* Progress Badge */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#374151',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 2
                  }}>
                    {course.status === 'completed' ? 'Completed' : 'Active'}
                  </Box>
                </Box>

                {/* Course Content */}
                <Box sx={{ p: 3, flex: 1, position: 'relative', zIndex: 2 }}>
                  <Typography variant="h6" sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700, 
                    color: '#111827',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontFamily: 'Poppins, Inter, sans-serif',
                    mb: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                              {course.C_title}
                           </Typography>
                  
                  <Typography variant="body2" sx={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    mb: 2,
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <Box component="span" sx={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      bgcolor: '#2563EB',
                      display: 'inline-block'
                    }} />
                    by {course.C_educator}
                           </Typography>
                  
                  <Box sx={{
                    display: 'inline-block', 
                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                    px: 2.5,
                    py: 0.75,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    color: '#374151',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    mb: 2,
                    border: '1px solid #E5E7EB'
                  }}>
                    {course.C_categories}
                  </Box>
                  
                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link
                      to={`/courseSection/${course._id}/${encodeURIComponent(course.C_title)}`}
                      style={{ textDecoration: 'none', width: '100%' }}
                      onClick={() => handleCourseClick(course._id)}
                    >
                      <Button 
                        size='small' 
                        variant="contained" 
                        startIcon={course.status === 'completed' ? <CheckIcon /> : <PlayIcon />}
                        sx={{ 
                          fontWeight: 700, 
                          borderRadius: '9999px',
                          background: course.status === 'completed'
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          '&:hover': {
                            background: course.status === 'completed'
                              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                              : 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
                          },
                        }}
                      >
                        {course.status === 'completed' ? 'Review' : 'Continue'}
                              </Button>
                           </Link>
                        </Box>
                </Box>
              </Box>
                  </Grid>
               ))
            ) : (
          <Typography color="text.secondary" align="center" sx={{ width: '100%', mt: 6 }}>
            No courses found.
               </Typography>
            )}
         </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      </Box>
  );
};

export default EnrolledCourses;
