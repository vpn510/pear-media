const geminiService = require('../services/geminiService');
const huggingfaceService = require('../services/huggingfaceService');
const Generation = require('../models/Generation');

const analyzeImage = async (req, res) => {
   try {
      let imageBase64, mimeType;

      if (req.file) {
         imageBase64 = req.file.buffer.toString('base64');
         mimeType = req.file.mimetype;
      } else if (req.body.imageBase64) {
         imageBase64 = req.body.imageBase64;
         mimeType = req.body.mimeType || 'image/jpeg';
      } else {
         return res.status(400).json({ error: 'Image is required' });
      }

      const analysis = await geminiService.analyzeImage(imageBase64, mimeType);

      res.json({
         analysis,
         imagePreview: `data:${mimeType};base64,${imageBase64}`,
      });
   } catch (error) {
      console.error('Image analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze image', details: error.message });
   }
};

const generateVariations = async (req, res) => {
   try {
      const { prompts } = req.body;
      if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
         return res.status(400).json({ error: 'Variation prompts are required' });
      }

      const sanitizedPrompts = prompts
         .filter(p => typeof p === 'string' && p.trim().length > 0)
         .map(p => p.trim().substring(0, 2000))
         .slice(0, 5);

      const variations = await huggingfaceService.generateVariations(sanitizedPrompts);

      try {
         await Generation.create({
            type: 'image-variation',
            originalInput: 'uploaded image',
            enhancedPrompt: sanitizedPrompts.join(' | '),
            generatedImages: variations.filter(v => v.success).map((v, i) => `variation_${i}_${Date.now()}`),
         });
      } catch (dbErr) {
         // DB not available, continue without persistence
      }

      res.json({ variations });
   } catch (error) {
      console.error('Variation generation error:', error);
      res.status(500).json({ error: 'Failed to generate variations', details: error.message });
   }
};

module.exports = { analyzeImage, generateVariations };
