import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, Switch, FormControlLabel, Button } from '@mui/material';
import axiosInstance from '../common/AxiosInstance';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/admin/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (res.data.success) setSettings(res.data.data);
        else setError(res.data.message || 'Failed to fetch settings');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.post('/api/admin/settings', {
        maintenanceMode: settings.maintenanceMode,
        allowRegistrations: settings.allowRegistrations,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data.success) setSettings(res.data.data);
      else alert(res.data.message || 'Failed to save settings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!settings) return null;

  return (
    <Paper sx={{ p: 4, maxWidth: 500 }}>
      <Typography variant="h6" mb={2}>Platform Settings</Typography>
      <FormControlLabel
        control={<Switch checked={settings.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} />}
        label="Maintenance Mode"
      />
      <FormControlLabel
        control={<Switch checked={settings.allowRegistrations} onChange={() => handleToggle('allowRegistrations')} />}
        label="Allow New Registrations"
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Paper>
  );
};

export default Settings; 