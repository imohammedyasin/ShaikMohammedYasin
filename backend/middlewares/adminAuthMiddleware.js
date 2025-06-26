const jwt = require('jsonwebtoken');

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decode = jwt.verify(token, process.env.JWT_KEY);
    
    if (!decode) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    if (decode.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.adminId = decode.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

module.exports = adminAuthMiddleware; 