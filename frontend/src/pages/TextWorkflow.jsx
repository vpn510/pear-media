import { useState } from 'react';
import { textAPI } from '../services/api';
import StepIndicator from '../components/StepIndicator';
import LoadingSpinner from '../components/LoadingSpinner';

const STEPS = ['Input', 'Analyze & Enhance', 'Generate Image'];

function TextWorkflow() {
   const [step, setStep] = useState(0);
   const [text, setText] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [analysisResult, setAnalysisResult] = useState(null);
   const [editedPrompt, setEditedPrompt] = useState('');
   const [generatedImage, setGeneratedImage] = useState('');

   const handleAnalyze = async () => {
      if (!text.trim()) return;
      setLoading(true);
      setError('');
      try {
         const { data } = await textAPI.analyze(text.trim());
         setAnalysisResult(data);
         setEditedPrompt(data.enhancement?.enhancedPrompt || text);
         setStep(1);
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to analyze text. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleGenerate = async () => {
      setLoading(true);
      setError('');
      try {
         const { data } = await textAPI.generate(
            editedPrompt,
            text,
            analysisResult?.analysis
         );
         setGeneratedImage(data.image);
         setStep(2);
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to generate image. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleReset = () => {
      setStep(0);
      setText('');
      setAnalysisResult(null);
      setEditedPrompt('');
      setGeneratedImage('');
      setError('');
   };

   return (
      <div className="animate-fade-in">
         <h1 className="text-3xl font-bold text-center mb-2">Text → Image Generation</h1>
         <p className="text-gray-500 text-center mb-8">
            Enter a prompt, review AI enhancements, and generate an image
         </p>

         <StepIndicator steps={STEPS} currentStep={step} />

         {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
               {error}
            </div>
         )}

         {loading && (
            <LoadingSpinner
               message={step === 0 ? 'Analyzing your prompt with AI...' : 'Generating image with Stable Diffusion...'}
            />
         )}

         {/* Step 0: Input */}
         {!loading && step === 0 && (
            <div className="max-w-2xl mx-auto">
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                     Describe the image you want to create
                  </label>
                  <textarea
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     placeholder="e.g., A serene mountain landscape at sunset with a reflective lake in the foreground..."
                     className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pear-500 focus:ring-1 focus:ring-pear-500 resize-none"
                     maxLength={2000}
                  />
                  <div className="flex justify-between items-center mt-3">
                     <span className="text-xs text-gray-600">{text.length}/2000</span>
                     <button
                        onClick={handleAnalyze}
                        disabled={!text.trim()}
                        className="px-6 py-2.5 bg-pear-500 text-white font-medium rounded-lg hover:bg-pear-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                     >
                        Analyze & Enhance ✨
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Step 1: Analysis & Enhancement */}
         {!loading && step === 1 && analysisResult && (
            <div className="max-w-3xl mx-auto space-y-6">
               {/* Analysis */}
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-pear-400">📊 Prompt Analysis</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Tone</div>
                        <div className="text-white font-medium">{analysisResult.analysis?.tone || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Intent</div>
                        <div className="text-white font-medium">{analysisResult.analysis?.intent || 'N/A'}</div>
                     </div>
                     {analysisResult.analysis?.themes && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Themes</div>
                           <div className="flex flex-wrap gap-1 mt-1">
                              {analysisResult.analysis.themes.map((t, i) => (
                                 <span key={i} className="px-2 py-0.5 bg-pear-500/20 text-pear-400 text-xs rounded-full">
                                    {t}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}
                     {analysisResult.enhancement?.style && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Style</div>
                           <div className="text-white font-medium">{analysisResult.enhancement.style}</div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Enhanced Prompt */}
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-pear-400">✨ Enhanced Prompt</h3>
                  <p className="text-xs text-gray-500 mb-3">Review and edit the AI-enhanced prompt before generating</p>
                  <textarea
                     value={editedPrompt}
                     onChange={(e) => setEditedPrompt(e.target.value)}
                     className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pear-500 focus:ring-1 focus:ring-pear-500 resize-none"
                     maxLength={2000}
                  />
                  {analysisResult.enhancement?.improvements && (
                     <div className="mt-3">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Improvements Made</div>
                        <ul className="space-y-1">
                           {analysisResult.enhancement.improvements.map((imp, i) => (
                              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                 <span className="text-pear-400 mt-0.5">•</span> {imp}
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}

                  <div className="flex gap-3 mt-4">
                     <button
                        onClick={() => setStep(0)}
                        className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                     >
                        ← Back
                     </button>
                     <button
                        onClick={handleGenerate}
                        disabled={!editedPrompt.trim()}
                        className="flex-1 px-6 py-2.5 bg-pear-500 text-white font-medium rounded-lg hover:bg-pear-600 disabled:opacity-40 transition-colors"
                     >
                        🎨 Approve & Generate Image
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Step 2: Generated Image */}
         {!loading && step === 2 && generatedImage && (
            <div className="max-w-3xl mx-auto space-y-6">
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-pear-400">🎨 Generated Image</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-700">
                     <img
                        src={`data:image/png;base64,${generatedImage}`}
                        alt="AI Generated"
                        className="w-full"
                     />
                  </div>
                  <div className="mt-4 bg-gray-800 rounded-lg p-4">
                     <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Prompt Used</div>
                     <p className="text-sm text-gray-300">{editedPrompt}</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                     <button
                        onClick={handleReset}
                        className="flex-1 px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                     >
                        🔄 Start Over
                     </button>
                     <a
                        href={`data:image/png;base64,${generatedImage}`}
                        download="pear-media-generated.png"
                        className="flex-1 px-5 py-2.5 bg-pear-500 text-white text-center font-medium rounded-lg hover:bg-pear-600 transition-colors"
                     >
                        ⬇️ Download Image
                     </a>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default TextWorkflow;
