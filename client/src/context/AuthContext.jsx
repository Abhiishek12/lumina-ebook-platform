import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('lumina_token');
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (e) {
          localStorage.removeItem('lumina_token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('lumina_token', data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
    return data.user;
  };

  const register = async (name, email, password, role) => {
    const data = await api.register(name, email, password, role);
    localStorage.setItem('lumina_token', data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lumina_token');
    setUser(null);
  };

  const quickDemoLogin = async (role = 'reader') => {
    if (role === 'author') {
      return await login('author@lumina.com', 'author123');
    }
    return await login('reader@lumina.com', 'reader123');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      quickDemoLogin,
      isAuthModalOpen,
      setIsAuthModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
