const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

router.post('/analyze', textController.analyzeText);
router.post('/generate', textController.generateImage);

module.exports = router;
