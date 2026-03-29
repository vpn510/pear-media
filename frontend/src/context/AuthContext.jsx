import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem('pear_token');
      const savedUser = localStorage.getItem('pear_user');
      if (token && savedUser) {
         try {
            setUser(JSON.parse(savedUser));
         } catch {
            localStorage.removeItem('pear_token');
            localStorage.removeItem('pear_user');
         }
      }
      setLoading(false);
   }, []);

   const login = async (email, password) => {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem('pear_token', data.token);
      localStorage.setItem('pear_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
   };

   const signup = async (name, email, password) => {
      const { data } = await authAPI.signup(name, email, password);
      localStorage.setItem('pear_token', data.token);
      localStorage.setItem('pear_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
   };

   const logout = () => {
      localStorage.removeItem('pear_token');
      localStorage.removeItem('pear_user');
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within AuthProvider');
   return context;
}
