import React from 'react';
import './LanguageSelector.css';
import { useLanguage } from '../context/LanguageContext';

function LanguageSelector() {
  const { language, setLanguage, currency, setCurrency } = useLanguage();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="language-selector">
      <select value={language} onChange={handleLanguageChange} className="lang-select">
        <option value="en">🇬🇧 English</option>
        <option value="hi">🇮🇳 हिंदी</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="zh">🇨🇳 中文 (简体)</option>
        <option value="ja">🇯🇵 日本語</option>
        <option value="ar">🇸🇦 العربية</option>
        <option value="ru">🇷🇺 Русский</option>
        <option value="pt">🇵🇹 Português</option>
        <option value="bn">🇧🇩 বাংলা</option>
        <option value="ur">🇵🇰 اردو</option>
        <option value="id">🇮🇩 Bahasa Indonesia</option>
        <option value="ta">🇮🇳 தமிழ்</option>
        <option value="te">🇮🇳 తెలుగు</option>
        <option value="ko">🇰🇷 한국어</option>
        <option value="it">🇮🇹 Italiano</option>
        <option value="nl">🇳🇱 Nederlands</option>
      </select>
      <select value={currency} onChange={handleCurrencyChange} className="currency-select">
        <option value="INR">₹ INR</option>
        <option value="USD">$ USD</option>
      </select>
    </div>
  );
}

export default LanguageSelector;
