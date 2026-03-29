const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/imageController');

const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 10 * 1024 * 1024 },
   fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
         cb(null, true);
      } else {
         cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
      }
   },
});

router.post('/analyze', upload.single('image'), imageController.analyzeImage);
router.post('/variations', imageController.generateVariations);

module.exports = router;
