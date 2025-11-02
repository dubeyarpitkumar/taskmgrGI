import React from 'react';
import AuthForm from '../components/AuthForm';
import { Sun, Moon } from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

const AuthPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useTranslation();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-secondary p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-background/50 backdrop-blur-3xl z-0"></div>
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-4">
        <div className="relative">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
            className="bg-transparent border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-background/50 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>

      <div className="w-full max-w-md z-10">
        <AuthForm />
      </div>
       <div className="absolute -bottom-32 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
       <div className="absolute -top-40 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default AuthPage;
