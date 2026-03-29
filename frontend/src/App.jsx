import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TextWorkflow from './pages/TextWorkflow';
import ImageWorkflow from './pages/ImageWorkflow';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedRoute({ children }) {
   const { user, loading } = useAuth();
   if (loading) return null;
   return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
   const { user, loading } = useAuth();
   if (loading) return null;
   return !user ? children : <Navigate to="/" replace />;
}

function App() {
   return (
      <div className="min-h-screen bg-gray-950 text-white">
         <Navbar />
         <main className="max-w-6xl mx-auto px-4 py-8">
            <Routes>
               <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
               <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
               <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
               <Route path="/text" element={<ProtectedRoute><TextWorkflow /></ProtectedRoute>} />
               <Route path="/image" element={<ProtectedRoute><ImageWorkflow /></ProtectedRoute>} />
            </Routes>
         </main>
      </div>
   );
}

export default App;
