import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const { login } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email.trim() || !password) return;
      setLoading(true);
      setError('');
      try {
         await login(email.trim(), password);
         navigate('/');
      } catch (err) {
         setError(err.response?.data?.error || 'Login failed. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
         <div className="w-full max-w-md">
            <div className="text-center mb-8">
               <span className="text-5xl">🍐</span>
               <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-pear-400 to-emerald-400 bg-clip-text text-transparent">
                  Welcome Back
               </h1>
               <p className="text-gray-500 mt-2">Sign in to Pear Media</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
               {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                     {error}
                  </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pear-500 focus:ring-1 focus:ring-pear-500"
                        required
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pear-500 focus:ring-1 focus:ring-pear-500"
                        required
                     />
                  </div>
                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full py-3 bg-pear-500 text-white font-semibold rounded-lg hover:bg-pear-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                     {loading ? 'Signing in...' : 'Sign In'}
                  </button>
               </form>

               <p className="text-center text-gray-500 text-sm mt-6">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-pear-400 hover:text-pear-300 font-medium">
                     Sign Up
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}

export default Login;
