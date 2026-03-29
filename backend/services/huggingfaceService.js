const { HfInference } = require('@huggingface/inference');
const config = require('../config/config');

const hf = new HfInference(config.huggingfaceApiKey);

const generateImage = async (prompt) => {
   const result = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
         num_inference_steps: 30,
         guidance_scale: 7.5,
      },
   });

   const buffer = Buffer.from(await result.arrayBuffer());
   return buffer.toString('base64');
};

const generateVariations = async (prompts) => {
   const results = [];
   for (const prompt of prompts) {
      try {
         const base64 = await generateImage(prompt);
         results.push({ prompt, image: base64, success: true });
      } catch (error) {
         results.push({ prompt, error: error.message, success: false });
      }
   }
   return results;
};

module.exports = { generateImage, generateVariations };
