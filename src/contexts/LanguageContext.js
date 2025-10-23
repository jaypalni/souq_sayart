/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';
import kuTranslations from '../locales/ku.json';

// Language context
const LanguageContext = createContext();

// Supported languages
const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
  KU: 'ku',
};

// Language files mapping
const languageFiles = {
  en: enTranslations,
  ar: arTranslations,
  ku: kuTranslations,
};

const LANGUAGE_STORAGE_KEY = 'app_language';


export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage && languageFiles[savedLanguage] ? savedLanguage : LANGUAGES.EN;
  });

  const [translations, setTranslations] = useState(languageFiles[currentLanguage]);

  useEffect(() => {
    setTranslations(languageFiles[currentLanguage]);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    
    
    if (currentLanguage === LANGUAGES.AR || currentLanguage === LANGUAGES.KU) {
      document.documentElement.dir = 'rtl';
      document.body.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
      document.body.dir = 'ltr';
    }
  }, [currentLanguage]);

  // /**
  //  * Get translation by key path with fallback to English
  //  * @param {string} key - Translation key in dot notation (e.g., 'myProfile.PAGE_TITLE')
  //  * @param {object} replacements - Object with replacement values for variables
  //  * @returns {string} - Translated text
  //  */
  // Helper: Get nested translation value from object by key array
const getNestedValue = (obj, keys) => {
  return keys.reduce((acc, k) => (acc && typeof acc === 'object' && k in acc ? acc[k] : undefined), obj);
};

// Helper: Get English fallback if translation is missing
const getEnglishFallback = (keys) => {
  return getNestedValue(languageFiles[LANGUAGES.EN], keys);
};

// Helper: Replace variables in string
const replaceVariables = (str, replacements) => {
  return str.replace(/\{\{(\w+)\}\}/g, (_, variable) =>
    replacements[variable] !== undefined ? replacements[variable] : `{{${variable}}}`
  );
};

const translate = (key, replacements = {}) => {
  const keys = key.split('.');
  
  // Try current language first
  let value = getNestedValue(translations, keys);

  // Fallback to English if missing
  if (value === undefined && currentLanguage !== LANGUAGES.EN) {
    value = getEnglishFallback(keys);
  }

  // Final fallback to key itself
  if (value === undefined) return key;

  // Replace variables if any
  if (typeof value === 'string' && Object.keys(replacements).length > 0) {
    value = replaceVariables(value, replacements);
  }

  return value;
};


  /**
   * Change current language
   * @param {string} language - Language code (e.g., 'en', 'ar')
   */
  const changeLanguage = (language) => {
    if (languageFiles[language]) {
      setCurrentLanguage(language);
    }
  };

  // Determine if current language is RTL
  const isRTL = currentLanguage === LANGUAGES.AR || currentLanguage === LANGUAGES.KU;

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    availableLanguages: Object.values(LANGUAGES),
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use language context
 * @returns {object} - Language context value
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

