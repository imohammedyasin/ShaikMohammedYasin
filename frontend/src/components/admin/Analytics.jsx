import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import axiosInstance from '../common/AxiosInstance';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (res.data.success) setData(res.data.data);
        else setError(res.data.message || 'Failed to fetch analytics');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">{data.totalUsers}</Typography>
          <Typography variant="subtitle1">Total Users</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">{data.totalCourses}</Typography>
          <Typography variant="subtitle1">Total Courses</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">{data.totalEnrollments}</Typography>
          <Typography variant="subtitle1">Total Enrollments</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">{data.activeUsers}</Typography>
          <Typography variant="subtitle1">Active Users</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Analytics; 