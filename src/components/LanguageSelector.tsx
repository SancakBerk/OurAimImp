"use client";
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { toast } from 'react-toastify';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className }) => {
  const { locale, setLocale } = useLocale();

  const handleLanguageChange = (newLocale: 'tr' | 'en') => {
    setLocale(newLocale);
    toast.info(
      newLocale === 'tr' ? 'Dil Türkçe olarak değiştirildi 🇹🇷' : 'Language changed to English 🇬🇧',
      { autoClose: 2000 }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value as 'tr' | 'en')}
        className="h-10 px-3 pr-8 rounded-lg border transition-all duration-200 cursor-pointer
          bg-gray-100 dark:bg-gray-800 
          border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white
          hover:bg-gray-200 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          appearance-none text-sm font-medium"
        title="Select Language"
      >
        <option value="tr">TR</option>
        <option value="en">EN</option>
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
