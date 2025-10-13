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

// Local storage key for language preference
const LANGUAGE_STORAGE_KEY = 'app_language';

/**
 * Language Provider Component
 * Manages the current language and provides translation functions
 */
export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or default to English
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage && languageFiles[savedLanguage] ? savedLanguage : LANGUAGES.EN;
  });

  const [translations, setTranslations] = useState(languageFiles[currentLanguage]);

  // Update translations and direction when language changes
  useEffect(() => {
    setTranslations(languageFiles[currentLanguage]);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    
    // Set text direction based on language
    // Arabic and Kurdish are RTL languages
    // if (currentLanguage === LANGUAGES.AR || currentLanguage === LANGUAGES.KU) {
    //   document.documentElement.dir = 'rtl';
    //   document.body.dir = 'rtl';
    // } else {
    //   document.documentElement.dir = 'ltr';
    //   document.body.dir = 'ltr';
    // }
  }, [currentLanguage]);

  /**
   * Get translation by key path with fallback to English
   * @param {string} key - Translation key in dot notation (e.g., 'myProfile.PAGE_TITLE')
   * @param {object} replacements - Object with replacement values for variables
   * @returns {string} - Translated text
   */
  const translate = (key, replacements = {}) => {
    const keys = key.split('.');
    let value = translations;

    // Try to find translation in current language
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if current language doesn't have translation
        if (currentLanguage !== LANGUAGES.EN && languageFiles[LANGUAGES.EN]) {
          let englishValue = languageFiles[LANGUAGES.EN];
          for (const k of keys) {
            if (englishValue && typeof englishValue === 'object' && k in englishValue) {
              englishValue = englishValue[k];
            } else {
              // Return key if even English doesn't have it
              return key;
            }
          }
          value = englishValue;
          break;
        } else {
          // Return key if translation not found
          return key;
        }
      }
    }

    // Replace variables in translation
    if (typeof value === 'string' && Object.keys(replacements).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
        return replacements[variable] !== undefined ? replacements[variable] : match;
      });
    }

    return value || key;
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

