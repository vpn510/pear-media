import { useState, useRef } from 'react';
import { imageAPI } from '../services/api';
import StepIndicator from '../components/StepIndicator';
import LoadingSpinner from '../components/LoadingSpinner';

const STEPS = ['Upload', 'Analyze', 'Generate Variations'];

function ImageWorkflow() {
   const [step, setStep] = useState(0);
   const [selectedFile, setSelectedFile] = useState(null);
   const [preview, setPreview] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [analysis, setAnalysis] = useState(null);
   const [variations, setVariations] = useState([]);
   const fileInputRef = useRef(null);

   const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
         setError('File size must be under 10MB');
         return;
      }

      setSelectedFile(file);
      setError('');
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
   };

   const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
         setSelectedFile(file);
         setError('');
         const reader = new FileReader();
         reader.onload = (ev) => setPreview(ev.target.result);
         reader.readAsDataURL(file);
      }
   };

   const handleAnalyze = async () => {
      if (!selectedFile) return;
      setLoading(true);
      setError('');
      try {
         const { data } = await imageAPI.analyze(selectedFile);
         setAnalysis(data.analysis);
         setStep(1);
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleGenerateVariations = async () => {
      if (!analysis?.variationPrompts?.length) return;
      setLoading(true);
      setError('');
      try {
         const { data } = await imageAPI.generateVariations(analysis.variationPrompts);
         setVariations(data.variations || []);
         setStep(2);
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to generate variations. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleReset = () => {
      setStep(0);
      setSelectedFile(null);
      setPreview('');
      setAnalysis(null);
      setVariations([]);
      setError('');
   };

   return (
      <div className="animate-fade-in">
         <h1 className="text-3xl font-bold text-center mb-2">Image Analysis & Variations</h1>
         <p className="text-gray-500 text-center mb-8">
            Upload an image, get AI analysis, and generate creative variations
         </p>

         <StepIndicator steps={STEPS} currentStep={step} />

         {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
               {error}
            </div>
         )}

         {loading && (
            <LoadingSpinner
               message={step === 0 ? 'Analyzing image with Gemini Vision...' : 'Generating variations with Stable Diffusion...'}
            />
         )}

         {/* Step 0: Upload */}
         {!loading && step === 0 && (
            <div className="max-w-2xl mx-auto">
               <div
                  className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-pear-500/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
               >
                  <input
                     type="file"
                     ref={fileInputRef}
                     onChange={handleFileSelect}
                     accept="image/jpeg,image/png,image/webp,image/gif"
                     className="hidden"
                  />

                  {preview ? (
                     <div>
                        <img
                           src={preview}
                           alt="Preview"
                           className="max-h-72 mx-auto rounded-lg mb-4"
                        />
                        <p className="text-gray-400 text-sm">{selectedFile?.name}</p>
                     </div>
                  ) : (
                     <div>
                        <div className="text-5xl mb-4">📁</div>
                        <p className="text-gray-300 font-medium mb-1">
                           Click or drag & drop an image
                        </p>
                        <p className="text-gray-600 text-sm">
                           Supports JPEG, PNG, WebP, GIF (max 10MB)
                        </p>
                     </div>
                  )}
               </div>

               {selectedFile && (
                  <div className="flex gap-3 mt-4">
                     <button
                        onClick={() => { setSelectedFile(null); setPreview(''); }}
                        className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                     >
                        Clear
                     </button>
                     <button
                        onClick={handleAnalyze}
                        className="flex-1 px-6 py-2.5 bg-pear-500 text-white font-medium rounded-lg hover:bg-pear-600 transition-colors"
                     >
                        🔍 Analyze Image
                     </button>
                  </div>
               )}
            </div>
         )}

         {/* Step 1: Analysis Results */}
         {!loading && step === 1 && analysis && (
            <div className="max-w-3xl mx-auto space-y-6">
               {/* Original Image */}
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-pear-400">📸 Original Image</h3>
                  <img src={preview} alt="Original" className="max-h-64 mx-auto rounded-lg" />
               </div>

               {/* Analysis Grid */}
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-pear-400">🔍 AI Analysis</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                     {analysis.objects && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Objects Detected</div>
                           <div className="flex flex-wrap gap-1">
                              {analysis.objects.map((obj, i) => (
                                 <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{obj}</span>
                              ))}
                           </div>
                        </div>
                     )}
                     {analysis.theme && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Theme</div>
                           <div className="text-white">{analysis.theme}</div>
                        </div>
                     )}
                     {analysis.mood && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Mood</div>
                           <div className="text-white">{analysis.mood}</div>
                        </div>
                     )}
                     {analysis.style && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Art Style</div>
                           <div className="text-white">{analysis.style}</div>
                        </div>
                     )}
                     {analysis.colors && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Color Palette</div>
                           <div className="flex flex-wrap gap-1">
                              {analysis.colors.map((c, i) => (
                                 <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">{c}</span>
                              ))}
                           </div>
                        </div>
                     )}
                     {analysis.composition && (
                        <div className="bg-gray-800 rounded-lg p-4">
                           <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Composition</div>
                           <div className="text-white text-sm">{analysis.composition}</div>
                        </div>
                     )}
                  </div>
                  {analysis.description && (
                     <div className="mt-4 bg-gray-800 rounded-lg p-4">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Description</div>
                        <p className="text-gray-300 text-sm">{analysis.description}</p>
                     </div>
                  )}
               </div>

               {/* Variation Prompts */}
               {analysis.variationPrompts?.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                     <h3 className="text-lg font-semibold mb-3 text-pear-400">🎭 Planned Variations</h3>
                     <ul className="space-y-2">
                        {analysis.variationPrompts.map((prompt, i) => (
                           <li key={i} className="text-sm text-gray-400 bg-gray-800 rounded-lg px-4 py-3 flex items-start gap-2">
                              <span className="text-pear-400 font-bold mt-px">{i + 1}.</span>
                              {prompt}
                           </li>
                        ))}
                     </ul>
                  </div>
               )}

               <div className="flex gap-3">
                  <button
                     onClick={handleReset}
                     className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                     ← Start Over
                  </button>
                  <button
                     onClick={handleGenerateVariations}
                     disabled={!analysis.variationPrompts?.length}
                     className="flex-1 px-6 py-2.5 bg-pear-500 text-white font-medium rounded-lg hover:bg-pear-600 disabled:opacity-40 transition-colors"
                  >
                     🎨 Generate Variations
                  </button>
               </div>
            </div>
         )}

         {/* Step 2: Generated Variations */}
         {!loading && step === 2 && variations.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-pear-400">🎨 Generated Variations</h3>

                  {/* Original for comparison */}
                  <div className="mb-6">
                     <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Original Image</p>
                     <img src={preview} alt="Original" className="max-h-48 rounded-lg" />
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {variations.map((v, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                           {v.success ? (
                              <>
                                 <img
                                    src={`data:image/png;base64,${v.image}`}
                                    alt={`Variation ${i + 1}`}
                                    className="w-full aspect-square object-cover"
                                 />
                                 <div className="p-3">
                                    <p className="text-xs text-gray-500 line-clamp-2">{v.prompt}</p>
                                    <a
                                       href={`data:image/png;base64,${v.image}`}
                                       download={`pear-variation-${i + 1}.png`}
                                       className="inline-block mt-2 text-xs text-pear-400 hover:text-pear-300"
                                    >
                                       ⬇️ Download
                                    </a>
                                 </div>
                              </>
                           ) : (
                              <div className="p-6 text-center">
                                 <div className="text-3xl mb-2">⚠️</div>
                                 <p className="text-sm text-gray-500">Generation failed</p>
                                 <p className="text-xs text-gray-600 mt-1">{v.error}</p>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               <button
                  onClick={handleReset}
                  className="w-full px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
               >
                  🔄 Start Over with New Image
               </button>
            </div>
         )}
      </div>
   );
}

export default ImageWorkflow;
