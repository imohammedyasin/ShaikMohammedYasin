import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import ReactPlayer from 'react-player';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

const AllCourses = () => {
   const navigate = useNavigate()
   const user = useContext(UserContext)
   const [allCourses, setAllCourses] = useState([]);
   const [enrolledCourses, setEnrolledCourses] = useState([]);
   const [filterTitle, setFilterTitle] = useState('');
   const [filterType, setFilterType] = useState('');

   const [showModal, setShowModal] = useState({});
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewUrl, setPreviewUrl] = useState('');
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
   const [cardDetails, setCardDetails] = useState({
      cardholdername: '',
      cardnumber: '',
      cvvcode: '',
      expmonthyear: '',
   })

   const handleChange = (e) => {
      setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })
   }

   const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
      if (coursePrice === 'free' || coursePrice === '0' || coursePrice === 0) {
         handleSubmit(courseId)
         return navigate(`/courseSection/${courseId}/${encodeURIComponent(courseTitle)}`)
      } else {
         setShowModal(prev => ({ ...prev, [courseIndex]: true }));
      }
   };

   const handleClose = (courseIndex) => {
      setShowModal(prev => ({ ...prev, [courseIndex]: false }));
   };

   const handlePreviewClose = () => {
      setPreviewOpen(false);
      setPreviewUrl('');
   };

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcourses`, {
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

   const getEnrolledCourses = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcoursesuser`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setEnrolledCourses(res.data.data);
         }
      } catch (error) {
         console.error('Error fetching enrolled courses:', error);
      }
   };

   const isEnrolledInCourse = (courseId) => {
      return enrolledCourses.some(enrolledCourse => enrolledCourse && enrolledCourse._id === courseId);
   };

   useEffect(() => {
      getAllCoursesUser();
      getEnrolledCourses();
      
      const handleCourseUpdate = () => {
        getAllCoursesUser();
        getEnrolledCourses();
      };
      
      window.addEventListener('courseUpdated', handleCourseUpdate);
      
      return () => {
        window.removeEventListener('courseUpdated', handleCourseUpdate);
      };
   }, []);

   const isPaidCourse = (course) => {
      return course.C_price !== 'free' && course.C_price !== '0' && course.C_price !== 0 && /\d/.test(course.C_price);
   };

   const handleSubmit = async (courseId) => {
      try {
         const res = await axiosInstance.post(`api/user/enrolledcourse/${courseId}`, cardDetails, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${encodeURIComponent(res.data.course.Title)}`);
         } else {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${encodeURIComponent(res.data.course.Title)}`);
         }
      } catch (error) {
         console.error('Error enrolling in course:', error);
         alert('Failed to enroll in course. Please try again.');
      }
   }

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

   const getPreviewUrl = (course) => {
      if (course.previewVideo) {
         return `http://localhost:8000${course.previewVideo}`;
      }
      if (course.sections && course.sections.length > 0 && course.sections[0].S_content) {
         return `http://localhost:8000${course.sections[0].S_content}`;
      }
      return '';
   };

   const isAdmin = localStorage.getItem('adminToken');
   const isTeacher = user && user.userLoggedIn && user.user && user.user.role === 'teacher';
   
   const isCourseCreator = (course) => {
      return user && user.userLoggedIn && user.user && course.userId === user.user._id;
   };
   
   const canEditCourse = (course) => {
      return isAdmin || (isTeacher && isCourseCreator(course));
   };

   const generateRandomEnrollment = (courseId) => {
      const seed = courseId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const random = (seed * 9301 + 49297) % 233280;
      const normalized = random / 233280;
      
      const minEnrollment = 50;
      const maxEnrollment = 2000;
      const enrollment = Math.floor(normalized * (maxEnrollment - minEnrollment) + minEnrollment);
      
      if (enrollment < 100) return enrollment;
      if (enrollment < 500) return Math.floor(enrollment / 10) * 10;
      if (enrollment < 1000) return Math.floor(enrollment / 50) * 50;
      return Math.floor(enrollment / 100) * 100;
   };

   const formatEnrollment = (number) => {
      if (number >= 1000) {
         return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
      return number.toString();
   };

   return (
      <>
         <Box sx={{ 
            background: '#FFFFFF', 
            borderRadius: 3, 
            p: 4, 
            mb: 4, 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #F3F4F6'
         }}>
            <Typography variant="h4" sx={{ 
               color: '#111827', 
               mb: 3, 
               fontWeight: 700,
               fontFamily: 'Poppins, Inter, sans-serif'
            }}>
               All Courses
            </Typography>
            
            <Box sx={{ 
               display: 'flex', 
               gap: 3, 
               flexWrap: 'wrap', 
               alignItems: 'center',
               mb: 2
            }}>
               <TextField
                  fullWidth
                  label="Search courses..."
                     placeholder="Search by course title..."
                     value={filterTitle}
                     onChange={(e) => setFilterTitle(e.target.value)}
                  sx={{ 
                     flex: 1, 
                     minWidth: 200,
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
                     '& .MuiInputBase-input::placeholder': {
                        color: '#9CA3AF',
                        opacity: 1,
                        fontFamily: 'Inter, sans-serif'
                     }
                  }}
               />
               
               <TextField
                  select
                  label="Filter"
                     value={filterType} 
                     onChange={(e) => setFilterType(e.target.value)}
                  inputProps={{
                     'aria-label': 'Filter courses by type',
                     'aria-describedby': 'filter-helper-text'
                  }}
                  SelectProps={{
                     MenuProps: {
                        PaperProps: {
                           'aria-label': 'Filter options',
                           sx: {
                              '& .MuiMenuItem-root': {
                                 '&:focus': {
                                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                 }
                              }
                           }
                        }
                     }
                  }}
                  sx={{ 
                     minWidth: 150,
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
               >
                  <MenuItem value="" aria-label="Show all courses">All Courses</MenuItem>
                  <MenuItem value="Paid" aria-label="Show paid courses only">Paid Courses</MenuItem>
                  <MenuItem value="Free" aria-label="Show free courses only">Free Courses</MenuItem>
               </TextField>
            </Box>
         </Box>

         <Grid container spacing={3}>
            {allCourses?.length > 0 ? (
               allCourses
                  .filter(
                     (course) =>
                        filterTitle === '' ||
                        course.C_title?.toLowerCase().includes(filterTitle?.toLowerCase())
                  )
                  .filter((course) => {
                     if (filterType === 'Free') {
                        return !isPaidCourse(course);
                     } else if (filterType === 'Paid') {
                        return isPaidCourse(course);
                     } else {
                        return true;
                     }
                  })
                  // Only show latest 3 courses if on Home page (add a prop or logic as needed)
                  .slice(-3)
                  .map((course, index) => (
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
                           
                           {/* Edit Button for Admin/Teacher */}
                           {canEditCourse(course) && (
                              <Tooltip title="Edit Course">
                                 <IconButton 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleEditOpen(course);
                                    }}
                                    sx={{ 
                                       position: 'absolute',
                                       top: 16,
                                       right: 16,
                                       zIndex: 10,
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
                                    <EditIcon />
                                 </IconButton>
                              </Tooltip>
                           )}
                           
                           {/* Course Thumbnail */}
                           <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                              {course.thumbnail ? (
                                 <img
                                    className="course-thumbnail"
                                    src={course.thumbnail.startsWith('/uploads') ? `http://localhost:8000${course.thumbnail}` : `http://localhost:8000/uploads/${course.thumbnail}`}
                                    alt={`Thumbnail for ${course.C_title}`}
                                    style={{
                                       width: '100%',
                                       height: '200px',
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
                                    height: '200px',
                                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottom: '1px solid #E5E7EB',
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
                                       fontSize: 48, 
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
                              
                              {/* Enrolled Badge */}
                              {isEnrolledInCourse(course._id) && (
                                 <Box sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: canEditCourse(course) ? 60 : 16,
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
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
                                    Enrolled
                                 </Box>
                              )}
                           </Box>
                           
                           {/* Course Content */}
                           <Box sx={{ p: 3, position: 'relative', zIndex: 2 }}>
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
                                 mb: 3,
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
                                       {isEnrolledInCourse(course._id) ? (
                                          <span style={{ color: '#10B981', fontWeight: 700 }}>Enrolled</span>
                                       ) : (
                                          <span style={{ color: '#2563EB', fontWeight: 700 }}>
                                             {formatEnrollment(generateRandomEnrollment(course._id))} enrolled
                                          </span>
                                       )}
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
                              
                              {/* Preview and Enroll Buttons */}
                              <Box sx={{ display: 'flex', gap: 1.5 }}>
                                 {getPreviewUrl(course) && !isEnrolledInCourse(course._id) && (
                                    <Button
                                       variant="outlined"
                                       size="small"
                                       onClick={() => {
                                          setPreviewUrl(getPreviewUrl(course));
                                          setPreviewOpen(true);
                                       }}
                                       sx={{ 
                                          fontWeight: 600, 
                                          borderRadius: '9999px',
                                          borderWidth: 2,
                                          borderColor: '#2563EB',
                                          color: '#2563EB',
                                          background: 'transparent',
                                          px: 3,
                                          py: 1,
                                          textTransform: 'none',
                                          fontSize: '0.875rem',
                                          fontFamily: 'Inter, sans-serif',
                                          transition: 'all 0.2s ease',
                                          flex: 1,
                                          '&:hover': {
                                             background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                                             borderColor: '#1749B1',
                                             color: '#1749B1',
                                             transform: 'translateY(-1px)',
                                             boxShadow: '0 4px 8px rgba(37, 99, 235, 0.2)'
                                          },
                                       }}
                                    >
                                       Preview
                                    </Button>
                                 )}
                           
                           {user && user.userLoggedIn === true ? (
                              <Button
                                       variant="contained"
                                       size="small"
                                       onClick={() => {
                                          if (isEnrolledInCourse(course._id)) {
                                             navigate(`/courseSection/${course._id}/${encodeURIComponent(course.C_title)}`);
                                          } else {
                                             handleShow(index, course.C_price, course._id, course.C_title);
                                          }
                                       }}
                                       sx={{ 
                                          fontWeight: 700, 
                                          borderRadius: '9999px',
                                          background: isEnrolledInCourse(course._id) 
                                             ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                             : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                          px: 3,
                                          py: 1,
                                          textTransform: 'none',
                                          fontSize: '0.875rem',
                                          fontFamily: 'Inter, sans-serif',
                                          transition: 'all 0.2s ease',
                                          flex: 2,
                                          '&:hover': {
                                             background: isEnrolledInCourse(course._id)
                                                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                                : 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                                             transform: 'translateY(-2px)',
                                             boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
                                          },
                                       }}
                                    >
                                       {isEnrolledInCourse(course._id) ? 'Continue Course' : 'Start Course'}
                              </Button>
                           ) : (
                                    <Link to={'/login'} style={{ textDecoration: 'none', flex: 2 }}>
                                 <Button
                                          variant="contained"
                                          size="small"
                                          sx={{ 
                                             fontWeight: 700, 
                                             borderRadius: '9999px',
                                             background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                                             boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                             px: 3,
                                             py: 1,
                                             textTransform: 'none',
                                             fontSize: '0.875rem',
                                             fontFamily: 'Inter, sans-serif',
                                             transition: 'all 0.2s ease',
                                             width: '100%',
                                             '&:hover': {
                                                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
                                             },
                                          }}
                                       >
                                          Start Course
                                 </Button>
                              </Link>
                           )}
                              </Box>
                           </Box>
                        </Box>
                        {/* Payment Modal for this course */}
                        {isPaidCourse(course) && !isEnrolledInCourse(course._id) && (
                           <Dialog open={!!showModal[index]} onClose={() => handleClose(index)} maxWidth="xs" fullWidth>
                              <DialogTitle sx={{ background: 'rgb(37, 99, 235)', color: '#fff', fontWeight: 700 }}>Payment Required</DialogTitle>
                              <DialogContent sx={{ background: '#fff', p: 3 }}>
                                 <Typography variant="body1" sx={{ mb: 2, color: '#111827' }}>
                                    Please enter your payment details to enroll in <b>{course.C_title}</b>.
                                 </Typography>
                                 <TextField
                                    label="Cardholder Name"
                                    name="cardholdername"
                                    value={cardDetails.cardholdername}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                 />
                                 <TextField
                                    label="Card Number"
                                    name="cardnumber"
                                    value={cardDetails.cardnumber}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                 />
                                 <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                       label="CVV"
                                       name="cvvcode"
                                       value={cardDetails.cvvcode}
                                       onChange={handleChange}
                                       sx={{ flex: 1 }}
                                    />
                                    <TextField
                                       label="Exp. Month/Year"
                                       name="expmonthyear"
                                       value={cardDetails.expmonthyear}
                                       onChange={handleChange}
                                       sx={{ flex: 1 }}
                                    />
                                 </Box>
                              </DialogContent>
                              <DialogActions sx={{ background: '#f3f4f6', p: 2 }}>
                                 <Button onClick={() => handleClose(index)} sx={{ color: '#6B7280' }}>Cancel</Button>
                                 <Button variant="contained" sx={{ bgcolor: 'rgb(37, 99, 235)' }} onClick={() => handleSubmit(course._id)}>
                                    Pay & Enroll
                                 </Button>
                              </DialogActions>
                           </Dialog>
                        )}
                     </Grid>
                  ))
            ) : (
               <Grid item xs={12}>
                  <Typography variant="h6" sx={{ 
                     color: '#6B7280', 
                     textAlign: 'center', 
                     mt: 4,
                     fontFamily: 'Inter, sans-serif'
                  }}>
                     No courses found.
                  </Typography>
               </Grid>
            )}
         </Grid>

         {/* Edit Course Modal */}
         <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ 
               background: '#0071bc', 
               color: '#ffffff', 
               fontWeight: 600,
               fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
               Edit Course
                          </DialogTitle>
            <DialogContent sx={{ 
               background: '#ffffff', 
               color: '#2c3e50', 
               p: 3,
               fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
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
                           background: '#ffffff',
                                  borderRadius: 2,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& fieldset': { borderColor: '#e1e5e9' },
                              '&:hover fieldset': { borderColor: '#0071bc' },
                              '&.Mui-focused fieldset': { borderColor: '#0071bc' },
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
                           background: '#ffffff',
                                  borderRadius: 2,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& fieldset': { borderColor: '#e1e5e9' },
                              '&:hover fieldset': { borderColor: '#0071bc' },
                              '&.Mui-focused fieldset': { borderColor: '#0071bc' },
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
                           background: '#ffffff',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& fieldset': { borderColor: '#e1e5e9' },
                              '&:hover fieldset': { borderColor: '#0071bc' },
                              '&.Mui-focused fieldset': { borderColor: '#0071bc' },
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
                           background: '#ffffff',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& fieldset': { borderColor: '#e1e5e9' },
                              '&:hover fieldset': { borderColor: '#0071bc' },
                              '&.Mui-focused fieldset': { borderColor: '#0071bc' },
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
                           background: '#ffffff',
                           borderRadius: 2,
                           '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& fieldset': { borderColor: '#e1e5e9' },
                              '&:hover fieldset': { borderColor: '#0071bc' },
                              '&.Mui-focused fieldset': { borderColor: '#0071bc' },
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
                           background: '#ffffff',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& fieldset': { borderColor: '#e1e5e9' },
                              '&:hover fieldset': { borderColor: '#0071bc' },
                              '&.Mui-focused fieldset': { borderColor: '#0071bc' },
                                    },
                                  }}
                                />
                  </Grid>
               </Grid>
                          </DialogContent>
            <DialogActions sx={{ 
               background: '#ffffff', 
               p: 2,
               fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
                            <Button
                  onClick={() => setEditModalOpen(false)}
                              sx={{
                     color: '#6c757d',
                     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                     '&:hover': { bgcolor: '#f8f9fa' }
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                  onClick={handleEditSave}
                              variant="contained"
                              sx={{
                     bgcolor: '#0071bc',
                     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                     '&:hover': { bgcolor: '#005a9e' }
                  }}
               >
                  Save Changes
                            </Button>
                          </DialogActions>
                        </Dialog>

         {/* Preview Modal */}
         <Dialog 
            open={previewOpen} 
            onClose={handlePreviewClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
               sx: {
                  maxHeight: '80vh',
                  overflow: 'hidden'
               }
            }}
         >
            <DialogTitle sx={{ 
               background: '#0071bc', 
               color: '#ffffff', 
               fontWeight: 600,
               fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center'
            }}>
               Course Preview
               <IconButton
                  onClick={handlePreviewClose}
                  sx={{
                     color: '#ffffff',
                     '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
               >
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>×</span>
               </IconButton>
            </DialogTitle>
            <DialogContent sx={{ 
               background: '#ffffff', 
               color: '#2c3e50', 
               p: 0,
               overflow: 'hidden',
               '&::-webkit-scrollbar': { display: 'none' },
               msOverflowStyle: 'none',
               scrollbarWidth: 'none'
            }}>
               {previewUrl ? (
                  <div style={{ 
                     width: '100%', 
                     height: '400px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     background: '#000'
                  }}>
                     <ReactPlayer 
                        url={previewUrl} 
                        controls 
                        width="100%" 
                        height="100%"
                        style={{ maxHeight: '400px' }}
                        config={{
                           file: {
                              attributes: {
                                 controlsList: 'nodownload',
                                 disablePictureInPicture: true
                              }
                           }
                        }}
                     />
                     </div>
            ) : (
               <div style={{ 
                     padding: '40px', 
                  textAlign: 'center', 
                     color: '#6c757d',
                     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
               }}>
                     No preview available.
               </div>
            )}
            </DialogContent>
         </Dialog>
      </>
   );
};

export default AllCourses;
