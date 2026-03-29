const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const generateToken = (userId) => {
   return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};

const signup = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      if (password.length < 6) {
         return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
         return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      const user = await User.create({
         name: name.trim(),
         email: email.toLowerCase().trim(),
         password,
      });

      const token = generateToken(user._id);

      res.status(201).json({
         token,
         user: { id: user._id, name: user.name, email: user.email },
      });
   } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create account.' });
   }
};

const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
      if (!user) {
         return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken(user._id);

      res.json({
         token,
         user: { id: user._id, name: user.name, email: user.email },
      });
   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to log in.' });
   }
};

const getMe = async (req, res) => {
   try {
      const user = await User.findById(req.userId);
      if (!user) {
         return res.status(404).json({ error: 'User not found.' });
      }
      res.json({ user: { id: user._id, name: user.name, email: user.email } });
   } catch (error) {
      res.status(500).json({ error: 'Failed to get user.' });
   }
};

module.exports = { signup, login, getMe };
