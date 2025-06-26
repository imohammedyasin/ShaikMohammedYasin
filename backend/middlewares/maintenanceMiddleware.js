const Settings = require('../schemas/settingsModel');

module.exports = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (settings && settings.maintenanceMode) {
      return res.status(503).json({ success: false, message: 'The platform is under maintenance. Please try again later.' });
    }
    next();
  } catch (err) {
    next(); // If error, do not block
  }
}; 