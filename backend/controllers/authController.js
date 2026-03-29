const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');

// In-memory user store (fallback when MongoDB is unavailable)
const memoryUsers = new Map();

const generateToken = (userId) => {
   return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};

const isDbAvailable = () => {
   const mongoose = require('mongoose');
   return mongoose.connection.readyState === 1;
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

      const normalizedEmail = email.toLowerCase().trim();

      if (isDbAvailable()) {
         const existingUser = await User.findOne({ email: normalizedEmail });
         if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
         }
         const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
         });
         const token = generateToken(user._id);
         return res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
         });
      }

      // In-memory fallback
      if (memoryUsers.has(normalizedEmail)) {
         return res.status(400).json({ error: 'An account with this email already exists.' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = 'mem_' + Date.now().toString(36);
      const newUser = { id: userId, name: name.trim(), email: normalizedEmail, password: hashedPassword };
      memoryUsers.set(normalizedEmail, newUser);
      const token = generateToken(userId);
      res.status(201).json({
         token,
         user: { id: userId, name: newUser.name, email: newUser.email },
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

      const normalizedEmail = email.toLowerCase().trim();

      if (isDbAvailable()) {
         const user = await User.findOne({ email: normalizedEmail }).select('+password');
         if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
         }
         const isMatch = await user.comparePassword(password);
         if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
         }
         const token = generateToken(user._id);
         return res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
         });
      }

      // In-memory fallback
      const memUser = memoryUsers.get(normalizedEmail);
      if (!memUser) {
         return res.status(401).json({ error: 'Invalid email or password.' });
      }
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (!isMatch) {
         return res.status(401).json({ error: 'Invalid email or password.' });
      }
      const token = generateToken(memUser.id);
      res.json({
         token,
         user: { id: memUser.id, name: memUser.name, email: memUser.email },
      });
   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to log in.' });
   }
};

const getMe = async (req, res) => {
   try {
      if (isDbAvailable()) {
         const user = await User.findById(req.userId);
         if (!user) {
            return res.status(404).json({ error: 'User not found.' });
         }
         return res.json({ user: { id: user._id, name: user.name, email: user.email } });
      }

      // In-memory fallback
      for (const [, u] of memoryUsers) {
         if (u.id === req.userId) {
            return res.json({ user: { id: u.id, name: u.name, email: u.email } });
         }
      }
      return res.status(404).json({ error: 'User not found.' });
   } catch (error) {
      res.status(500).json({ error: 'Failed to get user.' });
   }
};

module.exports = { signup, login, getMe };
