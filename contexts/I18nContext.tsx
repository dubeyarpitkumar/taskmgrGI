import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../constants';

type Language = 'en' | 'hi';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('todo_lang') as Language | null;
    if (storedLang && (storedLang === 'en' || storedLang === 'hi')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('todo_lang', lang);
  };

  const t = useCallback((key: string): string => {
      const langTranslations = translations[language] || translations.en;
      return langTranslations[key as keyof typeof langTranslations] || key;
    }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
