import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, Check } from './icons';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    addToast(t('toast.logout.success'), 'success');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : '?';
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-foreground">My Tasks</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(p => !p)}
                className="p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-secondary"
                aria-label="Toggle language"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
              </button>
              {langMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                  <div className="py-1">
                    <button onClick={() => { setLanguage('en'); setLangMenuOpen(false); }} className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-popover-foreground hover:bg-secondary">
                        <span>English</span>
                        {language === 'en' && <Check className="h-4 w-4 text-primary" />}
                    </button>
                    <button onClick={() => { setLanguage('hi'); setLangMenuOpen(false); }} className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-popover-foreground hover:bg-secondary">
                        <span>हिन्दी (Hindi)</span>
                        {language === 'hi' && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="User menu"
              >
                {getInitials(user?.email || '')}
              </button>
              {menuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm text-foreground font-medium truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;