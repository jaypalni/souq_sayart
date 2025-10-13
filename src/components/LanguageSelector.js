/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import { Select } from 'antd';
import { useLanguage } from '../contexts/LanguageContext';

const { Option } = Select;

/**
 * Language Selector Component
 * Allows users to switch between available languages
 */
const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    en: 'English',
    ar: 'العربية (Arabic)',
    fr: 'Français (French)',
  };

  return (
    <Select
      value={currentLanguage}
      onChange={changeLanguage}
      style={{ width: 150 }}
      size="middle"
    >
      {availableLanguages.map((lang) => (
        <Option key={lang} value={lang}>
          {languageNames[lang] || lang.toUpperCase()}
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelector;

