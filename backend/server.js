const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/config');

const authRoutes = require('./routes/authRoutes');
const textRoutes = require('./routes/textRoutes');
const imageRoutes = require('./routes/imageRoutes');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
   origin: process.env.FRONTEND_URL || '*',
   credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/text', auth, textRoutes);
app.use('/api/image', auth, imageRoutes);

// Health check
app.get('/api/health', (req, res) => {
   res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, '../frontend/dist')));
   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
   });
}

// Connect to MongoDB (optional - app works without it)
mongoose.connect(config.mongoUri)
   .then(() => {
      console.log('MongoDB connected');
      global.mongoConnected = true;
   })
   .catch(err => {
      console.warn('MongoDB not available, running with in-memory auth:', err.message);
      global.mongoConnected = false;
   });

app.listen(config.port, () => {
   console.log(`Server running on port ${config.port}`);
});
