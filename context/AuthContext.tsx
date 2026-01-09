
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: { phone: string; token: string; isAdmin?: boolean }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ws_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ws_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: { phone: string; token: string; isAdmin?: boolean }) => {
    const newUser: User = { 
      phone: userData.phone, 
      isAuthenticated: true, 
      isAdmin: userData.isAdmin 
    };
    setUser(newUser);
    localStorage.setItem('ws_user', JSON.stringify(newUser));
    localStorage.setItem('ws_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ws_user');
    localStorage.removeItem('ws_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
