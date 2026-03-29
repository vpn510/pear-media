import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
   const location = useLocation();
   const navigate = useNavigate();
   const { user, logout } = useAuth();

   const isActive = (path) =>
      location.pathname === path
         ? 'text-pear-400 border-b-2 border-pear-400'
         : 'text-gray-400 hover:text-white';

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   return (
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
               <Link to="/" className="flex items-center gap-2">
                  <span className="text-2xl">🍐</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-pear-400 to-emerald-400 bg-clip-text text-transparent">
                     Pear Media
                  </span>
               </Link>
               <div className="flex items-center gap-6">
                  {user ? (
                     <>
                        <Link to="/" className={`pb-1 transition-colors ${isActive('/')}`}>
                           Home
                        </Link>
                        <Link to="/text" className={`pb-1 transition-colors ${isActive('/text')}`}>
                           Text → Image
                        </Link>
                        <Link to="/image" className={`pb-1 transition-colors ${isActive('/image')}`}>
                           Image Variations
                        </Link>
                        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-700">
                           <span className="text-sm text-gray-400">{user.name}</span>
                           <button
                              onClick={handleLogout}
                              className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                           >
                              Logout
                           </button>
                        </div>
                     </>
                  ) : (
                     <>
                        <Link to="/login" className={`pb-1 transition-colors ${isActive('/login')}`}>
                           Sign In
                        </Link>
                        <Link
                           to="/signup"
                           className="px-4 py-1.5 bg-pear-500 text-white text-sm font-medium rounded-lg hover:bg-pear-600 transition-colors"
                        >
                           Sign Up
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </div>
      </nav>
   );
}

export default Navbar;
