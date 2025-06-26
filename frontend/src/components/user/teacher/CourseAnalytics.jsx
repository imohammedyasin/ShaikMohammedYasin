import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../common/AxiosInstance';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetailOpen, setStudentDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const isMobile = useMediaQuery('(max-width:768px)');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/user/courseanalytics/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [courseId]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setStudentDetailOpen(true);
  };

  const filteredStudents = analytics?.studentProgress?.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'completed') matchesFilter = student.isCompleted;
    else if (filterStatus === 'active') matchesFilter = student.completionRate > 0 && !student.isCompleted;
    else if (filterStatus === 'inactive') matchesFilter = student.completionRate === 0;

    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusColor = (completionRate) => {
    if (completionRate === 100) return 'success';
    if (completionRate >= 50) return 'warning';
    return 'error';
  };

  const getStatusLabel = (student) => {
    if (student.isCompleted) return 'Completed';
    if (student.completionRate > 0) return 'Active';
    return 'Not Started';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={fetchAnalytics}>Retry</Button>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No analytics data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
        </Link>
        
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          Course Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {analytics.courseInfo.title}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {analytics.engagementMetrics.totalEnrollments}
            </Typography>
            <Typography variant="body2">Total Enrollments</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
            <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {analytics.engagementMetrics.completedCourses}
            </Typography>
            <Typography variant="body2">Completed</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
            <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {analytics.engagementMetrics.activeStudents}
            </Typography>
            <Typography variant="body2">Active Students</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
            <BarChartIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {analytics.engagementMetrics.averageCompletionRate}%
            </Typography>
            <Typography variant="body2">Avg. Completion</Typography>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Section-wise Completion
        </Typography>
        <Grid container spacing={2}>
          {analytics.sectionAnalytics.map((section, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Section {index + 1}: {section.sectionTitle}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={section.completionRate} 
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {section.completionRate}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {section.studentsCompleted} of {analytics.engagementMetrics.totalEnrollments} students completed
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Student Progress
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
              sx={{ minWidth: 200 }}
            />
            
            <TextField
              select
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              inputProps={{
                'aria-label': 'Filter students by status',
                'aria-describedby': 'filter-status-helper'
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    'aria-label': 'Student status filter options',
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
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all" aria-label="Show all students">All Students</MenuItem>
              <MenuItem value="completed" aria-label="Show completed students only">Completed</MenuItem>
              <MenuItem value="active" aria-label="Show active students only">Active</MenuItem>
              <MenuItem value="inactive" aria-label="Show inactive students only">Not Started</MenuItem>
            </TextField>
          </Box>
        </Box>

        {isMobile ? (
          <Stack spacing={2}>
            {filteredStudents.map((student, index) => (
              <Card key={student.studentId} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {student.studentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student.studentEmail}
                    </Typography>
                  </Box>
                  <Chip 
                    label={getStatusLabel(student)} 
                    color={getStatusColor(student.completionRate)}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {student.completionRate}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={student.completionRate} 
                    color={getStatusColor(student.completionRate)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Enrolled: {formatDate(student.enrolledDate)}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => handleStudentClick(student)}
                    startIcon={<VisibilityIcon />}
                  >
                    Details
                  </Button>
                </Box>
              </Card>
            ))}
          </Stack>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Enrolled Date</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.studentId} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {student.studentName}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.studentEmail}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={student.completionRate} 
                          color={getStatusColor(student.completionRate)}
                          sx={{ flex: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 40 }}>
                          {student.completionRate}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(student)} 
                        color={getStatusColor(student.completionRate)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(student.enrolledDate)}</TableCell>
                    <TableCell>{formatDate(student.lastActivity)}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleStudentClick(student)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog 
        open={studentDetailOpen} 
        onClose={() => setStudentDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Student Details - {selectedStudent?.studentName}
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Student Information</Typography>
                  <Typography><strong>Name:</strong> {selectedStudent.studentName}</Typography>
                  <Typography><strong>Email:</strong> {selectedStudent.studentEmail}</Typography>
                  <Typography><strong>Enrolled:</strong> {formatDate(selectedStudent.enrolledDate)}</Typography>
                  {selectedStudent.certificateDate && (
                    <Typography><strong>Certificate Date:</strong> {formatDate(selectedStudent.certificateDate)}</Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Progress Summary</Typography>
                  <Typography><strong>Completed Sections:</strong> {selectedStudent.completedSections} / {selectedStudent.totalSections}</Typography>
                  <Typography><strong>Completion Rate:</strong> {selectedStudent.completionRate}%</Typography>
                  <Typography><strong>Status:</strong> {getStatusLabel(selectedStudent)}</Typography>
                  <Typography><strong>Last Activity:</strong> {formatDate(selectedStudent.lastActivity)}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Progress Visualization</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedStudent.completionRate} 
                      color={getStatusColor(selectedStudent.completionRate)}
                      sx={{ flex: 1, height: 12, borderRadius: 6 }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {selectedStudent.completionRate}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseAnalytics; 