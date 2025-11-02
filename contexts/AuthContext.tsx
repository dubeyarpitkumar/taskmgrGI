import React, { createContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock checking for a logged-in user in localStorage
    try {
      const storedUser = localStorage.getItem('todo_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('todo_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        // Mock success/failure. In a real app, this would be an API call.
        if (email === 'test@test.com' && pass === 'Password123!') {
          const mockUser: User = { id: '12345', email };
          setUser(mockUser);
          localStorage.setItem('todo_user', JSON.stringify(mockUser));
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const mockUser: User = { id: new Date().toISOString(), email };
        setUser(mockUser);
        localStorage.setItem('todo_user', JSON.stringify(mockUser));
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(null);
        localStorage.removeItem('todo_user');
        // also clear tasks for demo purposes
        localStorage.removeItem('todo_tasks');
        resolve();
      }, 500);
    });
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
     return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Password reset link sent to ${email}`);
        resolve();
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
};
