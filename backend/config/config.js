require('dotenv').config();

module.exports = {
   port: process.env.PORT || 5000,
   mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pear-media',
   geminiApiKey: process.env.GEMINI_API_KEY,
   huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
   jwtSecret: process.env.JWT_SECRET || 'pear-media-secret-key-2026',
};
