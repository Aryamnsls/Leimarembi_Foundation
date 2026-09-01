"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, DEFAULT_LANGUAGE } from './index';
import en from './dictionaries/en';
import hi from './dictionaries/hi';
import as from './dictionaries/as';
import mn from './dictionaries/mn';
import mzo from './dictionaries/mzo';

type DictionaryObj = Record<string, unknown>;

const dictionaries: Record<Language, DictionaryObj> = {
  en: en as unknown as DictionaryObj,
  hi: hi as unknown as DictionaryObj,
  as: as as unknown as DictionaryObj,
  mn: mn as unknown as DictionaryObj,
  mzo: mzo as unknown as DictionaryObj
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, fallback?: string) => string;
  isChanging: boolean;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'leimarembee_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Hydration-safe mount effect: restore saved language asynchronously after initial render pass
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Language;
        if (saved && (saved === 'en' || saved === 'hi' || saved === 'as' || saved === 'mn' || saved === 'mzo')) {
          setLanguageState(saved);
        }
      } catch (e) {
        console.error('Failed to restore language setting:', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    setIsChanging(true);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.error('Failed to save language setting:', e);
      }
    }

    // Smooth transition
    setTimeout(() => {
      setLanguageState(lang);
      setTimeout(() => {
        setIsChanging(false);
      }, 50);
    }, 120);
  };

  // Nested dictionary resolver (e.g. t('nav.home'))
  const t = (keyPath: string, fallback?: string): string => {
    // Before client mount completes, use DEFAULT_LANGUAGE ('en') to match SSR HTML 100% and avoid hydration mismatch
    const activeLang = mounted ? language : DEFAULT_LANGUAGE;

    const keys = keyPath.split('.');
    let currentDict: unknown = dictionaries[activeLang] || dictionaries[DEFAULT_LANGUAGE];
    let fallbackDict: unknown = dictionaries[DEFAULT_LANGUAGE];

    for (const key of keys) {
      if (currentDict && typeof currentDict === 'object' && (currentDict as Record<string, unknown>)[key] !== undefined) {
        currentDict = (currentDict as Record<string, unknown>)[key];
      } else {
        currentDict = undefined;
        break;
      }
    }

    if (typeof currentDict === 'string') {
      return currentDict;
    }

    // Fallback to English if translation missing
    for (const key of keys) {
      if (fallbackDict && typeof fallbackDict === 'object' && (fallbackDict as Record<string, unknown>)[key] !== undefined) {
        fallbackDict = (fallbackDict as Record<string, unknown>)[key];
      } else {
        fallbackDict = undefined;
        break;
      }
    }

    if (typeof fallbackDict === 'string') {
      return fallbackDict;
    }

    return fallback || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isChanging, mounted }}>
      <div 
        style={{ 
          opacity: isChanging ? 0.75 : 1, 
          transition: 'opacity 0.15s ease' 
        }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
