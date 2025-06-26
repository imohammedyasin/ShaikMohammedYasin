import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Grid, CardContent, CardActions, CardMedia, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import axiosInstance from '../../common/AxiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const TeacherHome = () => {
   const [allCourses, setAllCourses] = useState([]);
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [editCourse, setEditCourse] = useState(null);
   const [editForm, setEditForm] = useState({
      C_title: '',
      C_description: '',
      C_categories: '',
      C_price: '',
      thumbnail: '',
      previewVideo: '',
   });

   // Calculate summary analytics
   const summaryAnalytics = {
      totalCourses: allCourses.length,
      totalEnrollments: allCourses.reduce((sum, course) => sum + (course.enrolled || 0), 0),
      totalSections: allCourses.reduce((sum, course) => sum + (course.sections?.length || 0), 0),
      averageEnrollment: allCourses.length > 0 ? Math.round(allCourses.reduce((sum, course) => sum + (course.enrolled || 0), 0) / allCourses.length) : 0
   };

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcoursesteacher`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.error('Error fetching courses:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
      
      const handleCourseUpdate = () => {
        getAllCoursesUser();
      };
      
      window.addEventListener('courseUpdated', handleCourseUpdate);
      
      return () => {
        window.removeEventListener('courseUpdated', handleCourseUpdate);
      };
   }, []);

   const deleteCourse = async (courseId) => {
      const confirmation = confirm('Are you sure you want to delete this course?');
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`/api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            alert(res.data.message);
            await getAllCoursesUser();
            
            window.dispatchEvent(new CustomEvent('courseUpdated', { 
              detail: { courseId, action: 'delete' } 
            }));
         } else {
            alert("Failed to delete the course");
         }
      } catch (error) {
         console.error('Error deleting course:', error);
         alert('Failed to delete course. Please try again.');
      }
   };

   const toggleDescription = (courseId) => {
      setAllCourses(prevCourses =>
         prevCourses.map(course =>
            course._id === courseId
               ? { ...course, showFullDescription: !course.showFullDescription }
               : course
         )
      );
   };

   const handleEditOpen = (course) => {
      setEditCourse(course);
      setEditForm({
         C_title: course.C_title || '',
         C_description: course.C_description || '',
         C_categories: course.C_categories || '',
         C_price: course.C_price || '',
         thumbnail: course.thumbnail || '',
         previewVideo: course.previewVideo || '',
      });
      setEditModalOpen(true);
   };

   const handleEditChange = (e) => {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
   };

   const handleEditSave = async () => {
      if (!editCourse) return;
      try {
         const res = await axiosInstance.patch(`/api/user/editcourse/${editCourse._id}`, editForm, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            await getAllCoursesUser();
            setEditModalOpen(false);
            alert('Course updated successfully!');
            
            window.dispatchEvent(new CustomEvent('courseUpdated', { 
              detail: { courseId: editCourse._id, action: 'edit' } 
            }));
         } else {
            alert(res.data.message || 'Failed to update course.');
         }
      } catch (error) {
         console.error('Edit error:', error);
         alert(error.response?.data?.message || 'Failed to update course.');
      }
   };

   return (
      <Container sx={{ mt: 4 }}>
         {/* Summary Analytics */}
         <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={700} color="#FFC107" gutterBottom>
               Your Teaching Analytics
            </Typography>
            <Grid container spacing={3}>
               <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#FFC107', color: 'white', boxShadow: 3 }}>
                     <Typography variant="h4" fontWeight={700}>
                        {summaryAnalytics.totalCourses}
                     </Typography>
                     <Typography variant="body2">Total Courses</Typography>
                  </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#2196F3', color: 'white', boxShadow: 3 }}>
                     <Typography variant="h4" fontWeight={700}>
                        {summaryAnalytics.totalEnrollments}
                     </Typography>
                     <Typography variant="body2">Total Enrollments</Typography>
                  </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#4CAF50', color: 'white', boxShadow: 3 }}>
                     <Typography variant="h4" fontWeight={700}>
                        {summaryAnalytics.totalSections}
                     </Typography>
                     <Typography variant="body2">Total Sections</Typography>
                  </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#FF9800', color: 'white', boxShadow: 3 }}>
                     <Typography variant="h4" fontWeight={700}>
                        {summaryAnalytics.averageEnrollment}
                     </Typography>
                     <Typography variant="body2">Avg. Enrollments</Typography>
                  </Card>
               </Grid>
            </Grid>
         </Box>

         {allCourses.length > 0 ? (
            <Grid container spacing={3}>
               {allCourses.map((course) => (
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
                        minHeight: 340,
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
                                 <PlayCircleOutlineIcon sx={{ 
                                    fontSize: 60, 
                                    color: '#9CA3AF',
                                    zIndex: 1,
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                 }} />
                              </Box>
                           )}
                           
                           {/* Price Badge */}
                           <Box sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              background: course.C_price === 'free' || course.C_price === '0' || course.C_price === 0
                                 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                 : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
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
                              {course.C_price === 'free' || course.C_price === '0' || course.C_price === 0 ? 'FREE' : `₹${course.C_price}`}
                           </Box>
                           
                           {/* Action Buttons */}
                           <Box sx={{ 
                              position: 'absolute', 
                              top: 16, 
                              right: 16, 
                              display: 'flex', 
                              gap: 1,
                              zIndex: 2
                           }}>
                              <Tooltip title="View Analytics">
                                 <Link to={`/course-analytics/${course._id}`} style={{ textDecoration: 'none' }}>
                                    <IconButton 
                                       sx={{ 
                                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                                          color: '#2563EB',
                                          border: '1px solid rgba(37, 99, 235, 0.2)',
                                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                          backdropFilter: 'blur(8px)',
                                          '&:hover': { 
                                             bgcolor: '#FFFFFF',
                                             color: '#1749B1',
                                             boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                             transform: 'scale(1.1)'
                                          }
                                       }}
                                    >
                                       <AnalyticsIcon />
                                    </IconButton>
                                 </Link>
                              </Tooltip>
                              
                              <Tooltip title="Edit Course">
                                 <IconButton 
                                    onClick={() => handleEditOpen(course)} 
                                    sx={{ 
                                       bgcolor: 'rgba(255, 255, 255, 0.95)',
                                       color: '#F59E0B',
                                       border: '1px solid rgba(245, 158, 11, 0.2)',
                                       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                       backdropFilter: 'blur(8px)',
                                       '&:hover': { 
                                          bgcolor: '#FFFFFF',
                                          color: '#D97706',
                                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                          transform: 'scale(1.1)'
                                       }
                                    }}
                                 >
                                    <EditIcon />
                                 </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Delete Course">
                                 <IconButton 
                                    onClick={() => deleteCourse(course._id)} 
                                    sx={{ 
                                       bgcolor: 'rgba(255, 255, 255, 0.95)',
                                       color: '#EF4444',
                                       border: '1px solid rgba(239, 68, 68, 0.2)',
                                       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                       backdropFilter: 'blur(8px)',
                                       '&:hover': { 
                                          bgcolor: '#FFFFFF',
                                          color: '#DC2626',
                                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                          transform: 'scale(1.1)'
                                       }
                                    }}
                                 >
                                    <DeleteIcon />
                                 </IconButton>
                              </Tooltip>
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
                           
                           <Box sx={{
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              mb: 2,
                              p: 2,
                              background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                              borderRadius: 2,
                              border: '1px solid #E2E8F0'
                           }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <Box sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: '#10B981',
                                    display: 'inline-block'
                                 }} />
                                 <Typography variant="caption" sx={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    fontWeight: 600,
                                    fontFamily: 'Inter, sans-serif',
                                 }}>
                                    {course.enrolled || 0} enrolled
                           </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <Box sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: '#2563EB',
                                    display: 'inline-block'
                                 }} />
                                 <Typography variant="caption" sx={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    fontWeight: 600,
                                    fontFamily: 'Inter, sans-serif',
                                 }}>
                                    {course.sections?.length || 0} sections
                           </Typography>
                              </Box>
                           </Box>
                           
                           <Typography variant="body2" sx={{
                              color: '#6B7280',
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 2
                           }}>
                              {course.showFullDescription ? course.C_description : `${course.C_description.slice(0, 120)}${course.C_description.length > 120 ? '...' : ''}`}
                           </Typography>
                           
                           {course.C_description.length > 120 && (
                              <Button 
                                 size="small" 
                                 sx={{ 
                                    color: '#2563EB', 
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                       background: 'rgba(37, 99, 235, 0.05)'
                                    }
                                 }}
                                 onClick={() => toggleDescription(course._id)}
                              >
                                 {course.showFullDescription ? 'Show Less' : 'Show More'}
                              </Button>
                           )}
                        </Box>
                     </Box>
                  </Grid>
               ))}
            </Grid>
         ) : (
            <Typography color="var(--text-secondary)">No courses found!!</Typography>
         )}

         {/* Edit Course Modal */}
         <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ background: 'var(--secondary-dark)', color: 'var(--gold-primary)', fontWeight: 700 }}>
               Edit Course
            </DialogTitle>
            <DialogContent sx={{ background: 'var(--secondary-dark)', color: 'var(--text-primary)', p: 3 }}>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        label="Course Title"
                        name="C_title"
                        value={editForm.C_title}
                        onChange={handleEditChange}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{
                           mb: 2,
                           background: '#f5f7fa',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#e3eafc' },
                              '&:hover fieldset': { borderColor: '#1976d2' },
                              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        label="Course Description"
                        name="C_description"
                        value={editForm.C_description}
                        onChange={handleEditChange}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                           mb: 2,
                           background: '#f5f7fa',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#e3eafc' },
                              '&:hover fieldset': { borderColor: '#1976d2' },
                              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <TextField
                        label="Category"
                        name="C_categories"
                        value={editForm.C_categories}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        sx={{
                           mb: 2,
                           background: '#f5f7fa',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#e3eafc' },
                              '&:hover fieldset': { borderColor: '#1976d2' },
                              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <TextField
                        label="Price"
                        name="C_price"
                        value={editForm.C_price}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        placeholder="free or amount"
                        sx={{
                           mb: 2,
                           background: '#f5f7fa',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#e3eafc' },
                              '&:hover fieldset': { borderColor: '#1976d2' },
                              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <TextField
                        label="Thumbnail Path"
                        name="thumbnail"
                        value={editForm.thumbnail}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        placeholder="/uploads/filename.jpg"
                        sx={{
                           mb: 2,
                           background: '#f5f7fa',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#e3eafc' },
                              '&:hover fieldset': { borderColor: '#1976d2' },
                              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                           },
                        }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <TextField
                        label="Preview Video Path"
                        name="previewVideo"
                        value={editForm.previewVideo}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        placeholder="/uploads/filename.mp4"
                        sx={{
                           mb: 2,
                           background: '#f5f7fa',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: '#e3eafc' },
                              '&:hover fieldset': { borderColor: '#1976d2' },
                              '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                           },
                        }}
                     />
                  </Grid>
               </Grid>
            </DialogContent>
            <DialogActions sx={{ background: 'var(--secondary-dark)', p: 2 }}>
               <Button 
                  onClick={() => setEditModalOpen(false)}
                  sx={{ 
                     color: 'var(--text-secondary)',
                     '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                  }}
               >
                  Cancel
               </Button>
               <Button 
                  onClick={handleEditSave}
                  sx={{ 
                     bgcolor: 'var(--gold-primary)',
                     color: 'var(--text-primary)',
                     '&:hover': { bgcolor: 'var(--gold-secondary)' }
                  }}
               >
                  Save Changes
               </Button>
            </DialogActions>
         </Dialog>
      </Container>
   );
};

export default TeacherHome;
