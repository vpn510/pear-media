const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
   type: {
      type: String,
      enum: ['text-to-image', 'image-variation'],
      required: true,
   },
   originalInput: { type: String },
   analysis: { type: mongoose.Schema.Types.Mixed },
   enhancedPrompt: { type: String },
   generatedImages: [{ type: String }],
   createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Generation', generationSchema);
