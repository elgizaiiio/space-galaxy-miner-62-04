
import React from 'react';

interface LanguageSwitcherProps {
  onLanguageChange?: (languageCode: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  // Return null to hide the language switcher completely
  return null;
};

export default LanguageSwitcher;
