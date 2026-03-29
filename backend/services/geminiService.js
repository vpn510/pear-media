const { GoogleGenerativeAI } = require('@google/generative-ai');
const { HfInference } = require('@huggingface/inference');
const config = require('../config/config');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const hf = new HfInference(config.huggingfaceApiKey);

const HF_TEXT_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';

// ── Helper: extract JSON from response text ──
const extractJson = (text) => {
   const match = text.match(/\{[\s\S]*\}/);
   if (match) return JSON.parse(match[0]);
   return null;
};

// ── Helper: HuggingFace chat completion ──
const hfChat = async (systemPrompt, userMessage, maxTokens = 600) => {
   const res = await hf.chatCompletion({
      model: HF_TEXT_MODEL,
      messages: [
         { role: 'system', content: systemPrompt },
         { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
   });
   return res.choices[0].message.content;
};

// ── Gemini wrapper with HF fallback ──
const geminiOrFallback = async (prompt, fallbackFn) => {
   try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
   } catch (geminiErr) {
      console.warn('Gemini unavailable, using HuggingFace fallback:', geminiErr.message.substring(0, 80));
      return fallbackFn();
   }
};

// ═══════════════════════════════════════════
// TEXT ANALYSIS
// ═══════════════════════════════════════════
const analyzeText = async (text) => {
   const systemPrompt = `You are a text analysis AI. Respond ONLY in valid JSON, no extra text.`;
   const userPrompt = `Analyze the following text prompt and provide:
1. Tone (e.g., formal, casual, creative, technical)
2. Intent (what the user wants to achieve)
3. Key themes/subjects
4. Suggested improvements

Text: "${text}"

Respond ONLY in valid JSON format:
{
  "tone": "...",
  "intent": "...",
  "themes": ["..."],
  "suggestions": ["..."]
}`;

   const response = await geminiOrFallback(userPrompt, () => hfChat(systemPrompt, userPrompt));

   const parsed = extractJson(response);
   if (parsed) return parsed;
   return { tone: 'creative', intent: text, themes: [text.split(' ')[0]], suggestions: ['Add more detail'] };
};

// ═══════════════════════════════════════════
// PROMPT ENHANCEMENT
// ═══════════════════════════════════════════
const enhancePrompt = async (text, analysis) => {
   const systemPrompt = `You are an expert prompt engineer for AI image generation (Stable Diffusion). Respond ONLY in valid JSON.`;
   const userPrompt = `Given the user's original text and analysis, create an enhanced, detailed prompt for AI image generation.

Original text: "${text}"
Analysis: ${JSON.stringify(analysis)}

Create an enhanced prompt that:
- Is highly descriptive and specific
- Includes style, lighting, composition details
- Maintains the user's original intent
- Is optimized for Stable Diffusion

Respond ONLY in valid JSON format:
{
  "enhancedPrompt": "...",
  "style": "...",
  "improvements": ["list of what was improved"]
}`;

   const response = await geminiOrFallback(userPrompt, () => hfChat(systemPrompt, userPrompt));

   const parsed = extractJson(response);
   if (parsed && parsed.enhancedPrompt) return parsed;
   // Manual fallback if JSON parsing fails
   return {
      enhancedPrompt: `${text}, highly detailed, professional photography, dramatic lighting, 8k resolution, masterpiece`,
      style: 'photorealistic',
      improvements: ['Added detail level', 'Added lighting', 'Added resolution'],
   };
};

// ═══════════════════════════════════════════
// IMAGE ANALYSIS (Gemini Vision → HF fallback)
// ═══════════════════════════════════════════
const analyzeImage = async (imageBase64, mimeType) => {
   const visionPrompt = `Analyze this image in detail and provide:
1. Objects detected
2. Theme/mood
3. Art style
4. Color palette
5. Composition
6. A detailed text description suitable for recreating this image with AI

Respond ONLY in valid JSON format:
{
  "objects": ["..."],
  "theme": "...",
  "mood": "...",
  "style": "...",
  "colors": ["..."],
  "composition": "...",
  "description": "...",
  "variationPrompts": [
    "prompt for variation 1 - different artistic style",
    "prompt for variation 2 - different mood or atmosphere",
    "prompt for variation 3 - different composition or angle"
  ]
}`;

   // Try Gemini Vision first
   try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const imagePart = {
         inlineData: {
            data: imageBase64,
            mimeType: mimeType || 'image/jpeg',
         },
      };
      const result = await model.generateContent([visionPrompt, imagePart]);
      const response = result.response.text();
      const parsed = extractJson(response);
      if (parsed) return parsed;
   } catch (geminiErr) {
      console.warn('Gemini Vision unavailable:', geminiErr.message.substring(0, 80));
   }

   // Fallback: HuggingFace image-to-text → then LLM analysis
   try {
      const imgBuffer = Buffer.from(imageBase64, 'base64');
      const blob = new Blob([imgBuffer], { type: mimeType || 'image/jpeg' });
      const captionResult = await hf.imageToText({
         model: 'Salesforce/blip-image-captioning-large',
         data: blob,
      });
      const caption = captionResult.generated_text || 'an image';
      console.log('HF image caption:', caption);

      // Use LLM to expand caption into full analysis
      const systemPrompt = `You are an image analysis AI. Based on an image caption, generate a detailed analysis. Respond ONLY in valid JSON.`;
      const userMsg = `Based on this image description: "${caption}"

Generate a detailed analysis in this JSON format:
{
  "objects": ["list objects in the image"],
  "theme": "overall theme",
  "mood": "mood of the image",
  "style": "art style",
  "colors": ["main colors"],
  "composition": "composition description",
  "description": "${caption}",
  "variationPrompts": [
    "variation 1: ${caption}, but in watercolor painting style, soft and ethereal",
    "variation 2: ${caption}, but in dark moody atmosphere, dramatic lighting",
    "variation 3: ${caption}, but in anime style, vibrant colors"
  ]
}`;

      const llmResponse = await hfChat(systemPrompt, userMsg, 800);
      const parsed = extractJson(llmResponse);
      if (parsed) return parsed;

      // Minimal fallback
      return {
         objects: [caption],
         theme: 'general',
         mood: 'neutral',
         style: 'photographic',
         colors: ['various'],
         composition: 'standard',
         description: caption,
         variationPrompts: [
            `${caption}, watercolor painting style, soft colors, ethereal`,
            `${caption}, dramatic dark atmosphere, cinematic lighting`,
            `${caption}, anime style, vibrant colors, detailed illustration`,
         ],
      };
   } catch (hfErr) {
      console.error('HF image analysis fallback failed:', hfErr.message);
      return {
         objects: ['unknown'],
         theme: 'general',
         mood: 'neutral',
         style: 'photographic',
         colors: ['various'],
         composition: 'standard',
         description: 'An uploaded image',
         variationPrompts: [
            'A beautiful scene in watercolor painting style',
            'A dramatic scene with cinematic lighting',
            'A vibrant anime-style illustration',
         ],
      };
   }
};

module.exports = { analyzeText, enhancePrompt, analyzeImage };
