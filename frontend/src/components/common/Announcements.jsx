import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import axiosInstance from './AxiosInstance';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/admin/announcements');
        if (res.data.success) setAnnouncements(res.data.data);
        else setError(res.data.message || 'Failed to fetch announcements');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Don't render anything if there are no announcements
  if (!loading && !error && announcements.length === 0) {
    return null;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Announcements</Typography>
        {loading ? <CircularProgress sx={{ m: 2 }} /> : error ? <Alert severity="error">{error}</Alert> : (
          <List>
            {announcements.map(a => (
              <ListItem key={a._id} alignItems="flex-start">
                <ListItemText
                  primary={a.message}
                  secondary={new Date(a.createdAt).toLocaleString() + (a.createdBy ? ` (by ${a.createdBy})` : '')}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Announcements; 