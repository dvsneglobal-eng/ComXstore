
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: { phone: string; token: string; isAdmin?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const savedUser = await AsyncStorage.getItem('ws_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const login = async (userData: { phone: string; token: string; isAdmin?: boolean }) => {
    const newUser: User = { 
      phone: userData.phone, 
      isAuthenticated: true, 
      isAdmin: userData.isAdmin 
    };
    setUser(newUser);
    await AsyncStorage.setItem('ws_user', JSON.stringify(newUser));
    await AsyncStorage.setItem('ws_token', userData.token);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('ws_user');
    await AsyncStorage.removeItem('ws_token');
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
