import { Link } from 'react-router-dom';

function Home() {
   return (
      <div className="animate-fade-in">
         {/* Hero */}
         <div className="text-center py-16">
            <h1 className="text-5xl font-bold mb-4">
               <span className="bg-gradient-to-r from-pear-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  AI-Powered
               </span>{' '}
               Creative Studio
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
               Transform your ideas into stunning images. Enhance text prompts with AI analysis
               or upload images to generate creative variations.
            </p>
         </div>

         {/* Workflow Cards */}
         <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Text Workflow */}
            <Link
               to="/text"
               className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-pear-500/50 transition-all hover:shadow-lg hover:shadow-pear-500/10"
            >
               <div className="text-4xl mb-4">✍️</div>
               <h2 className="text-2xl font-bold mb-3 group-hover:text-pear-400 transition-colors">
                  Text → Image
               </h2>
               <p className="text-gray-400 mb-6">
                  Enter a text prompt and let AI analyze, enhance, and generate stunning images from your description.
               </p>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                     <span className="w-6 h-6 rounded-full bg-pear-500/20 text-pear-400 flex items-center justify-center text-xs font-bold">1</span>
                     Enter your text prompt
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                     <span className="w-6 h-6 rounded-full bg-pear-500/20 text-pear-400 flex items-center justify-center text-xs font-bold">2</span>
                     AI analyzes tone, intent & enhances prompt
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                     <span className="w-6 h-6 rounded-full bg-pear-500/20 text-pear-400 flex items-center justify-center text-xs font-bold">3</span>
                     Approve & generate image
                  </div>
               </div>
               <div className="mt-6 text-pear-400 font-medium group-hover:translate-x-2 transition-transform">
                  Get Started →
               </div>
            </Link>

            {/* Image Workflow */}
            <Link
               to="/image"
               className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-pear-500/50 transition-all hover:shadow-lg hover:shadow-pear-500/10"
            >
               <div className="text-4xl mb-4">🖼️</div>
               <h2 className="text-2xl font-bold mb-3 group-hover:text-pear-400 transition-colors">
                  Image Variations
               </h2>
               <p className="text-gray-400 mb-6">
                  Upload an image and AI will analyze its content, style, and mood — then generate creative variations.
               </p>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                     <span className="w-6 h-6 rounded-full bg-pear-500/20 text-pear-400 flex items-center justify-center text-xs font-bold">1</span>
                     Upload your image
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                     <span className="w-6 h-6 rounded-full bg-pear-500/20 text-pear-400 flex items-center justify-center text-xs font-bold">2</span>
                     AI detects objects, theme & style
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                     <span className="w-6 h-6 rounded-full bg-pear-500/20 text-pear-400 flex items-center justify-center text-xs font-bold">3</span>
                     Generate unique variations
                  </div>
               </div>
               <div className="mt-6 text-pear-400 font-medium group-hover:translate-x-2 transition-transform">
                  Get Started →
               </div>
            </Link>
         </div>

         {/* Tech Stack */}
         <div className="mt-16 text-center">
            <h3 className="text-sm uppercase tracking-wider text-gray-600 mb-4">Powered By</h3>
            <div className="flex justify-center gap-8 text-gray-500">
               <span className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 text-sm">Google Gemini</span>
               <span className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 text-sm">Hugging Face</span>
               <span className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 text-sm">Stable Diffusion XL</span>
               <span className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 text-sm">React + Express</span>
            </div>
         </div>
      </div>
   );
}

export default Home;
