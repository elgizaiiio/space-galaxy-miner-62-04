
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getStoredLanguage, setStoredLanguage } from '../utils/language';

interface LanguageSwitcherProps {
  onLanguageChange?: (languageCode: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: typeof SUPPORTED_LANGUAGES[0]) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language.code);
    
    // Force page reload to apply language changes
    window.location.reload();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-white/10 h-10 px-3 rounded-xl flex items-center gap-2"
      >
        <Languages className="w-4 h-4" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:block text-sm">{currentLanguage.name}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2 space-y-1">
            {SUPPORTED_LANGUAGES.map((language) => (
              <Button
                key={language.code}
                variant="ghost"
                onClick={() => handleLanguageChange(language)}
                className={`w-full justify-start text-left h-10 px-3 rounded-lg hover:bg-white/10 ${
                  currentLanguage.code === language.code 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-lg mr-3">{language.flag}</span>
                <span className="text-sm">{language.name}</span>
                {currentLanguage.code === language.code && (
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
