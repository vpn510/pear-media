const geminiService = require('../services/geminiService');
const huggingfaceService = require('../services/huggingfaceService');
const Generation = require('../models/Generation');

const analyzeText = async (req, res) => {
   try {
      const { text } = req.body;
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
         return res.status(400).json({ error: 'Text is required' });
      }

      const sanitizedText = text.trim().substring(0, 2000);
      const analysis = await geminiService.analyzeText(sanitizedText);
      const enhancement = await geminiService.enhancePrompt(sanitizedText, analysis);

      res.json({
         analysis,
         enhancement,
         originalText: sanitizedText,
      });
   } catch (error) {
      console.error('Text analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze text', details: error.message });
   }
};

const generateImage = async (req, res) => {
   try {
      const { prompt, originalText, analysis } = req.body;
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
         return res.status(400).json({ error: 'Prompt is required' });
      }

      const sanitizedPrompt = prompt.trim().substring(0, 2000);
      const imageBase64 = await huggingfaceService.generateImage(sanitizedPrompt);

      try {
         await Generation.create({
            type: 'text-to-image',
            originalInput: originalText || sanitizedPrompt,
            analysis,
            enhancedPrompt: sanitizedPrompt,
            generatedImages: [`generated_${Date.now()}`],
         });
      } catch (dbErr) {
         // DB not available, continue without persistence
      }

      res.json({
         image: imageBase64,
         prompt: sanitizedPrompt,
      });
   } catch (error) {
      console.error('Image generation error:', error);
      res.status(500).json({ error: 'Failed to generate image', details: error.message });
   }
};

module.exports = { analyzeText, generateImage };
