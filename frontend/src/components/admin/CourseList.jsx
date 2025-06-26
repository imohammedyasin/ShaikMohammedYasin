import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from '../common/AxiosInstance';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    C_title: '',
    C_description: '',
    C_educator: '',
    C_categories: '',
    C_price: '',
    thumbnail: '',
    previewVideo: '',
  });

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/api/admin/getallcourses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data.success) {
        setCourses(res.data.data);
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
    
    // Listen for course updates from other components
    const handleCourseUpdate = () => {
      fetchCourses();
    };
    
    window.addEventListener('courseUpdated', handleCourseUpdate);
    
    return () => {
      window.removeEventListener('courseUpdated', handleCourseUpdate);
    };
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      const res = await axiosInstance.delete(`/api/admin/deletecourse/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data.success) {
        await fetchCourses();
        alert('Course deleted successfully!');
        
        // Trigger a global refresh event for other components
        window.dispatchEvent(new CustomEvent('courseUpdated', { 
          detail: { courseId, action: 'delete' } 
        }));
      } else {
        alert(res.data.message || 'Delete failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Edit functionality
  const handleEditOpen = (course) => {
    setEditCourse(course);
    setEditForm({
      C_title: course.C_title || '',
      C_description: course.C_description || '',
      C_educator: course.C_educator || '',
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
      const res = await axiosInstance.patch(`/api/admin/editcourse/${editCourse._id}`, editForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (res.data.success) {
        await fetchCourses();
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

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Educator</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Enrolled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course._id}>
                <TableCell>{course._id}</TableCell>
                <TableCell>{course.C_title}</TableCell>
                <TableCell>{course.C_educator}</TableCell>
                <TableCell>{course.C_categories}</TableCell>
                <TableCell>{course.C_price === 'free' || course.C_price === '0' || course.C_price === 0 ? 'Free' : `₹${course.C_price}`}</TableCell>
                <TableCell>{course.enrolled}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Course">
                    <IconButton 
                      onClick={() => handleEditOpen(course)}
                      sx={{ 
                        color: 'primary.main', 
                        mr: 1,
                        '&:hover': { bgcolor: 'primary.light' } 
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Button color="error" size="small" onClick={() => handleDelete(course._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Course Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: '#1976d2', color: 'white', fontWeight: 700 }}>
          Edit Course (Admin)
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
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
                label="Educator (Read Only)"
                name="C_educator"
                value={editForm.C_educator}
                fullWidth
                variant="outlined"
                disabled
                sx={{
                  mb: 2,
                  background: '#f5f5f5',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&.Mui-disabled': {
                      backgroundColor: '#f5f5f5',
                      color: '#666666'
                    }
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
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setEditModalOpen(false)}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSave}
            variant="contained"
            sx={{ 
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseList; 