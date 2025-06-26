import React, { useState, useEffect, useContext, useMemo, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Button,
  Box,
  Paper,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Card,
  CardContent,
  CardMedia,
  useMediaQuery,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Snackbar,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandIcon,
  KeyboardArrowRight as ArrowIcon,
  VideoLibrary as VideoIcon,
  Download as DownloadIcon,
  Help as HelpIcon,
  Star as StarIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Fullscreen as FullscreenIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const CourseContent = () => {
  const user = useContext(UserContext);
  const { courseId, courseTitle } = useParams();
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [courseContent, setCourseContent] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
  const [completedSections, setCompletedSections] = useState([]);
  const [completedModule, setCompletedModule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [selectedSection, setSelectedSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState('all');
  const [showHelp, setShowHelp] = useState(false);
  const [lastAccessed, setLastAccessed] = useState(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const completedModuleIds = completedModule.map((item) => item.sectionId);

  const addEnhancedData = (sections) => {
    return sections.map((section, index) => ({
      ...section,
      lastAccessed: section.lastAccessed || null,
      completed: completedModuleIds.includes(index),
    }));
  };

   const downloadPdfDocument = (rootElementId) => {
      const input = document.getElementById(rootElementId);
      html2canvas(input).then((canvas) => {
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF();
         pdf.addImage(imgData, 'JPEG', -35, 10);
      pdf.save('learnhub-certificate.pdf');
      });
   };

   const getCourseContent = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get(`api/user/coursecontent/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCourseContent(res.data.courseContent);
        setCompletedModule(res.data.completeModule);
        setCertificate(res.data.certficateData);
        setLastAccessed(parseInt(localStorage.getItem(`lastAccessed_${courseId}`) || '0'));
      } else {
        setError(res.data.message || "Failed to load course content");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load course content");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

   useEffect(() => {
      getCourseContent();
      // If no last accessed section, open the first section
      const lastAccessedSection = localStorage.getItem(`lastAccessed_${courseId}`);
      if (!lastAccessedSection) {
        setSelectedSection(0);
      }
   }, [courseId]);

  // Filter and search logic
  const filteredContent = useMemo(() => {
    let filtered = courseContent;
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(section =>
        section.S_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.S_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(section => {
        const isCompleted = completedModuleIds.includes(courseContent.indexOf(section));
        return filterStatus === 'completed' ? isCompleted : !isCompleted;
      });
    }
    
    return filtered;
  }, [courseContent, searchTerm, filterStatus, completedModuleIds]);

  // Video event handlers
  const handleVideoReady = useCallback(() => {
    // Video is ready to play
  }, []);

  const handleAutoComplete = useCallback(async (sectionIndex) => {
    try {
      const res = await axiosInstance.post(`api/user/completemodule`, {
        courseId,
        sectionId: sectionIndex
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        setSnackbarMessage("Section completed automatically!");
        setShowSnackbar(true);
        getCourseContent();
      }
    } catch (error) {
      setSnackbarMessage("Failed to complete section automatically.");
      setShowSnackbar(true);
    }
  }, [courseId, getCourseContent]);

   const playVideo = useCallback((videoPath, index) => {
      setCurrentVideo(videoPath);
      setPlayingSectionIndex(index);
    setSelectedSection(index);
    localStorage.setItem(`lastAccessed_${courseId}`, index.toString());
   }, [courseId]);

   const completeModule = useCallback(async (sectionId) => {
      if (completedModule.length < courseContent.length) {
         if (playingSectionIndex !== -1 && !completedSections.includes(playingSectionIndex)) {
            setCompletedSections(prev => [...prev, playingSectionIndex]);

            try {
               const res = await axiosInstance.post(`api/user/completemodule`, {
                  courseId,
                  sectionId: sectionId
               }, {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
               });
               if (res.data.success) {
            setSnackbarMessage("Section marked as completed!");
            setShowSnackbar(true);
            getCourseContent();
            if (completedModule.length + 1 === courseContent.length) {
              setSnackbarMessage("Congratulations! You have completed the course.");
              setShowSnackbar(true);
            }
               }
            } catch (error) {
               setSnackbarMessage("Failed to mark section as completed. Please try again.");
               setShowSnackbar(true);
            }
         }
      } else {
         setShowModal(true);
      }
   }, [completedModule.length, courseContent.length, playingSectionIndex, completedSections, courseId, getCourseContent]);

  if (loading) {
   return (
      <>
         <NavBar onDashboardClick={() => navigate('/dashboard')} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </>
    );
  }

  return (
    <>
      <NavBar onDashboardClick={() => navigate('/dashboard')} />
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        mt: 2, 
        mb: 4, 
        px: { xs: 1, sm: 3 },
        minHeight: 'calc(100vh - 100px)'
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
             <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<ArrowIcon />}
                sx={{ 
                  fontWeight: 700, 
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Back to My Courses
               </Button>
             </Link>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Tooltip title="Help & Tips" arrow>
                <IconButton 
                  onClick={() => setShowHelp(!showHelp)}
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'white', 
                    '&:hover': { bgcolor: 'primary.main' } 
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Box>
           </Box>

          {/* Course Title and Progress */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f5faff 100%)', border: '1px solid #e0e0e0' }}>
            <Typography variant="h4" fontWeight={800} sx={{ color: 'rgb(37, 99, 235)' }} mb={1}>
              {courseTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Master new skills with our comprehensive course content
               </Typography>
            
            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="primary">{courseContent.length}</Typography>
                <Typography variant="caption" color="text.secondary">Total Sections</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="success.main">{completedModule.length}</Typography>
                <Typography variant="caption" color="text.secondary">Completed</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color="warning.main">{courseContent.length - completedModule.length}</Typography>
                <Typography variant="caption" color="text.secondary">Remaining</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Help Section */}
        <Fade in={showHelp}>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}>
            <Typography variant="h6" fontWeight={700} color="warning.dark" mb={2}>
              💡 Quick Tips
               </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">🎯 Navigation</Typography>
                <Typography variant="body2" color="text.secondary">Use the sidebar to jump between sections. Completed sections are marked with a green check.</Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">📚 Progress Tracking</Typography>
                <Typography variant="body2" color="text.secondary">Your progress is automatically saved when you mark sections as completed.</Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">🔍 Search & Filter</Typography>
                <Typography variant="body2" color="text.secondary">Use the search bar to find specific content or filter by completion status.</Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">📱 Mobile Friendly</Typography>
                <Typography variant="body2" color="text.secondary">The course interface adapts to your device size for optimal viewing.</Typography>
              </Box>
            </Box>
             </Paper>
        </Fade>

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={1}>{error}</Typography>
            <Typography variant="body2">If you believe this is a mistake, please contact support or your course instructor.</Typography>
          </Alert>
           ) : (
          <Box sx={{ display: 'flex', gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Sidebar: Course Navigation */}
            <Paper elevation={3} sx={{ 
              width: isMobile ? '100%' : 350, 
              background: '#fff', 
              borderRadius: 3, 
              p: 2, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
              border: '1px solid #e0e0e0',
              height: 'fit-content',
              position: isMobile ? 'static' : 'sticky',
              top: 20
            }}>
              {/* Search and Filter */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {['all', 'completed', 'in-progress'].map((status) => (
                    <Chip
                      key={status}
                      label={status === 'all' ? 'All' : status === 'completed' ? 'Completed' : 'In Progress'}
                      color={filterStatus === status ? 'primary' : 'default'}
                      onClick={() => setFilterStatus(status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Course Sections */}
              <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                   Course Sections
                 </Typography>
              
              <Box sx={{ maxHeight: isMobile ? 'auto' : '60vh', overflowY: 'auto' }}>
                {filteredContent.map((section, idx) => {
                     const isSectionCompleted = completedModuleIds.includes(idx);
                  const isSelected = selectedSection === idx;
                  const isLastAccessed = lastAccessed === idx;
                  
                     return (
                    <Zoom in={true} style={{ transitionDelay: `${idx * 100}ms` }} key={idx}>
                      <Card
                        key={idx}
                        onClick={() => setSelectedSection(idx)}
                        sx={{
                          mb: 2,
                          cursor: 'pointer',
                         borderRadius: 2,
                          border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          background: isSelected ? '#e3f2fd' : '#fff',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            borderColor: '#1976d2'
                          },
                          position: 'relative'
                        }}
                        tabIndex={0}
                        aria-label={`Section ${idx + 1}: ${section.S_title}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedSection(idx);
                          }
                        }}
                      >
                        {isLastAccessed && (
                          <Box sx={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            bgcolor: 'warning.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                         display: 'flex',
                         alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            zIndex: 1
                          }}>
                            <TimeIcon fontSize="small" />
                          </Box>
                        )}
                        
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ flex: 1 }}>
                              {section.S_title}
                            </Typography>
                            {isSectionCompleted && (
                              <CheckIcon color="success" sx={{ ml: 1 }} />
                            )}
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {section.S_description}
                          </Typography>
                          
                          {/* Prominent Play Button for Video Content */}
                          {section.S_content && (
                            <Box sx={{ mb: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlayIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playVideo(section.S_content, idx);
                                }}
                                sx={{
                                  bgcolor: 'rgb(37, 99, 235)',
                                  color: '#ffffff',
                                  fontWeight: 600,
                                  borderRadius: '20px',
                                  px: 2,
                                  py: 0.5,
                                  textTransform: 'none',
                                  fontSize: '12px',
                                  '&:hover': {
                                    bgcolor: 'rgb(17, 63, 158)',
                                    transform: 'scale(1.05)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Play Video
                              </Button>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <VideoIcon fontSize="small" />
                              {section.S_content ? 'Video Content' : 'Text Content'}
                            </Typography>
                       </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                     );
                   })}
                 </Box>
               </Paper>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {courseContent[selectedSection] ? (
                <Paper elevation={3} sx={{ 
                  background: '#fff', 
                  borderRadius: 3, 
                  p: 3, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                  border: '1px solid #e0e0e0'
                }}>
                  {/* Section Header */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Typography variant="h5" fontWeight={700} color="primary">
                       {courseContent[selectedSection].S_title}
                     </Typography>
                      {completedModuleIds.includes(selectedSection) && (
                        <Chip label="Completed" color="success" icon={<CheckIcon />} />
                      )}
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                       {courseContent[selectedSection].S_description}
                     </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VideoIcon fontSize="small" />
                        Video Content
                      </Typography>
                    </Box>
                  </Box>

                  {/* Enhanced Video Player */}
                     {courseContent[selectedSection].S_content ? (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
                         <ReactPlayer
                          ref={videoRef}
                           url={`http://localhost:8000${courseContent[selectedSection].S_content}`}
                           width='100%'
                          height={isMobile ? '200px' : '400px'}
                           controls
                          playing={isPlaying}
                          onPlay={() => {
                            setIsPlaying(true);
                            playVideo(courseContent[selectedSection].S_content, selectedSection);
                          }}
                          onPause={() => setIsPlaying(false)}
                          onReady={handleVideoReady}
                          onError={(e) => {
                            console.error('Video error:', e);
                            console.error('Video URL that failed:', `http://localhost:8000${courseContent[selectedSection].S_content}`);
                            setSnackbarMessage("Video failed to load. Please try again.");
                            setShowSnackbar(true);
                          }}
                          style={{ borderRadius: 8 }}
                          config={{
                            file: {
                              attributes: {
                                controlsList: 'nodownload',
                                onContextMenu: e => e.preventDefault()
                              }
                            }
                          }}
                        />
                        
                        {/* Prominent Play Button Overlay */}
                        {!isPlaying && (
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10
                          }}>
                            <Button
                              variant="contained"
                              size="large"
                              startIcon={<PlayIcon />}
                              onClick={() => setIsPlaying(true)}
                              sx={{
                                bgcolor: 'rgb(37, 99, 235)',
                                color: '#ffffff',
                                fontWeight: 700,
                                borderRadius: '50px',
                                px: 4,
                                py: 2,
                                textTransform: 'none',
                                fontSize: '16px',
                                boxShadow: '0 8px 25px rgba(0, 113, 188, 0.4)',
                                '&:hover': {
                                  bgcolor: 'rgb(17, 63, 158)',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 12px 35px rgba(0, 113, 188, 0.6)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Play Video
                            </Button>
                          </Box>
                        )}
                      </Box>
                      
                      {/* Video Controls */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Tooltip title={isPlaying ? "Pause" : "Play"} arrow>
                          <IconButton 
                            onClick={() => setIsPlaying(!isPlaying)}
                            sx={{ 
                              bgcolor: 'rgb(37, 99, 235)', 
                              color: 'white', 
                              '&:hover': { bgcolor: 'rgb(17, 63, 158)' } 
                            }}
                          >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Fullscreen" arrow>
                          <IconButton 
                            onClick={() => videoRef.current?.getInternalPlayer()?.requestFullscreen()}
                            sx={{ border: '1px solid #e0e0e0' }}
                          >
                            <FullscreenIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                       </Box>
                     ) : (
                       <Box sx={{ mb: 3 }}>
                         <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                           <Typography variant="h6" color="text.secondary" textAlign="center">
                             No video content available for this section
                           </Typography>
                           <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                             This section contains text content only.
                           </Typography>
                         </Paper>
                       </Box>
                     )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    {!completedModuleIds.includes(selectedSection) && !completedSections.includes(selectedSection) ? (
                      <Tooltip title="Mark this section as completed" arrow>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => completeModule(selectedSection)}
                          disabled={playingSectionIndex !== selectedSection}
                          startIcon={<CheckIcon />}
                          sx={{ 
                            fontWeight: 700, 
                            borderRadius: 2,
                            background: 'rgb(37, 99, 235)',
                            '&:hover': {
                              background: 'rgb(17, 63, 158)'
                            }
                          }}
                        >
                          Mark as Completed
                        </Button>
                      </Tooltip>
                    ) : (
                      <Chip 
                        label="Section Completed" 
                        color="success" 
                        icon={<CheckIcon />} 
                        sx={{ fontSize: '1rem', py: 1 }}
                      />
                    )}
                  </Box>
                </Paper>
              ) : (
                <Paper elevation={3} sx={{ 
                  background: '#fff', 
                  borderRadius: 3, 
                  p: 4, 
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                  border: '1px solid #e0e0e0'
                }}>
                  <Typography variant="h6" color="text.secondary">
                    Select a section to start learning
                       </Typography>
                </Paper>
                 )}
               </Box>
             </Box>
           )}

        {/* Certificate Modal */}
         <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            aria-labelledby="certificate-modal-title"
         >
          <DialogTitle id="certificate-modal-title">
            🎉 Completion Certificate
             </DialogTitle>
          <DialogContent style={{ background: '#fff', color: '#333' }}>
            <Typography variant="h6" color="primary" mb={2}>
              Congratulations! You have successfully completed all sections of this course.
            </Typography>
            <div id='certificate-download' className="certificate text-center" style={{ 
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f5faff 100%)', 
              borderRadius: 12, 
              padding: 32, 
              border: '2px solid #1976d2', 
              color: '#333',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h4" color="primary" fontWeight={800} mb={3}>
                🏆 Certificate of Completion
              </Typography>
                  <div className="content">
                <Typography variant="body1" mb={2}>This is to certify that</Typography>
                <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
                  {user.userData.name}
                </Typography>
                <Typography variant="body1" mb={2}>has successfully completed the course</Typography>
                <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
                  {courseTitle}
                </Typography>
                <Typography variant="body1" mb={2}>on</Typography>
                <Typography variant="body1" className="date">
                  {new Date(certificate).toLocaleDateString()}
                </Typography>
                  </div>
               </div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                onClick={() => downloadPdfDocument('certificate-download')} 
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                sx={{ 
                  fontWeight: 700, 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                  }
                }}
              >
                Download Certificate
              </Button>
            </Box>
            </DialogContent>
         </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
      </>
   );
};

export default React.memo(CourseContent);

