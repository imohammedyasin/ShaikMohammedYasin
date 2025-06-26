const Settings = require('../schemas/settingsModel');

module.exports = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (settings && settings.allowRegistrations === false) {
      return res.status(403).json({ success: false, message: 'New registrations are currently disabled by the admin.' });
    }
    next();
  } catch (err) {
    next(); // If error, do not block
  }
}; 