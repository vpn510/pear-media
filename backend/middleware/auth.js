const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      req.userId = decoded.userId;
      next();
   } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
   }
};

module.exports = auth;
