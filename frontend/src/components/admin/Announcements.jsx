import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import axiosInstance from '../common/AxiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/api/admin/announcements', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data.success) setAnnouncements(res.data.data);
      else setError(res.data.message || 'Failed to fetch announcements');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setPosting(true);
    try {
      const res = await axiosInstance.post('/api/admin/announcements', { message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data.success) {
        setMessage('');
        fetchAnnouncements();
      } else {
        alert(res.data.message || 'Failed to post announcement');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Post New Announcement</Typography>
        <form onSubmit={handlePost} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <TextField
            label="Announcement Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            fullWidth
            required
            size="small"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={posting}
            sx={{
               borderRadius: '50px',
               fontWeight: 700,
               textTransform: 'none',
               px: 4,
               py: 1.5,
               fontSize: '14px',
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
               boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               position: 'relative',
               overflow: 'hidden',
               '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
               },
               '&:disabled': {
                  opacity: 0.7,
                  transform: 'none',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
               },
               '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
               },
               '&:hover::before': {
                  left: '100%',
               },
            }}
          >
            {posting ? 'Posting...' : 'Post'}
          </Button>
        </form>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Announcements</Typography>
        {loading ? <CircularProgress sx={{ m: 2 }} /> : error ? <Alert severity="error">{error}</Alert> : (
          <List>
            {announcements.map(a => (
              <ListItem key={a._id} alignItems="flex-start"
                secondaryAction={
                  <Button
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={async () => {
                      if (!window.confirm('Delete this announcement?')) return;
                      try {
                        await axiosInstance.delete(`/api/admin/announcements/${a._id}`, {
                          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                        });
                        fetchAnnouncements();
                      } catch (err) {
                        alert('Failed to delete announcement');
                      }
                    }}
                    sx={{
                       borderRadius: '50px',
                       fontWeight: 600,
                       textTransform: 'none',
                       px: 2,
                       py: 0.5,
                       fontSize: '12px',
                       boxShadow: '0 4px 16px rgba(244, 67, 54, 0.2)',
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                       '&:hover': {
                          background: 'rgba(244, 67, 54, 0.1)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 20px rgba(244, 67, 54, 0.3)',
                       }
                    }}
                  >
                    Delete
                  </Button>
                }
              >
                <ListItemText
                  primary={a.message}
                  secondary={new Date(a.createdAt).toLocaleString() + (a.createdBy ? ` (by ${a.createdBy})` : '')}
                />
              </ListItem>
            ))}
            {announcements.length === 0 && <Typography color="text.secondary">No announcements yet.</Typography>}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Announcements; 