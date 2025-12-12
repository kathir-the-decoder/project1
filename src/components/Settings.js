import React, { useState, useEffect } from 'react';
import './Settings.css';
import { useLanguage } from '../context/LanguageContext';

function Settings({ onClose, user }) {
  const { t, language, setLanguage, currency, setCurrency } = useLanguage();
  
  const [settings, setSettings] = useState({
    // Display Settings
    theme: 'dark',
    fontSize: 'medium',
    showPrices: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    bookingReminders: true,
    
    // Privacy Settings
    shareData: false,
    locationAccess: false,
    
    // Booking Limitations
    maxGuestsPerBooking: 10,
    advanceBookingDays: 90,
    minBookingNotice: 2,
    
    // Search Preferences
    defaultSort: 'rating',
    showOnlyAvailable: true,
    priceRange: { min: 0, max: 5000 },
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
      // Apply saved settings
      applyTheme(parsed.theme || 'dark');
      applyFontSize(parsed.fontSize || 'medium');
    }
  }, []);

  const applyTheme = (theme) => {
    let effectiveTheme = theme;
    
    // Handle auto theme based on system preference
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    if (effectiveTheme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  };

  const applyFontSize = (size) => {
    document.documentElement.setAttribute('data-font-size', size);
    const fontSizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = fontSizes[size] || '16px';
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    
    // Apply theme and font size immediately
    if (key === 'theme') {
      applyTheme(value);
    }
    if (key === 'fontSize') {
      applyFontSize(value);
    }
  };

  const handlePriceRangeChange = (type, value) => {
    const newSettings = {
      ...settings,
      priceRange: { ...settings.priceRange, [type]: parseInt(value) }
    };
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'dark',
      fontSize: 'medium',
      showPrices: true,
      emailNotifications: true,
      smsNotifications: false,
      promotionalEmails: true,
      bookingReminders: true,
      shareData: false,
      locationAccess: false,
      maxGuestsPerBooking: 10,
      advanceBookingDays: 90,
      minBookingNotice: 2,
      defaultSort: 'rating',
      showOnlyAvailable: true,
      priceRange: { min: 0, max: 5000 },
    };
    saveSettings(defaultSettings);
    alert(t('settingsReset') || 'Settings reset to default!');
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ {t('settings') || 'Settings'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          {/* Language & Currency */}
          <div className="settings-section">
            <h3>🌐 {t('languageCurrency') || 'Language & Currency'}</h3>
            <div className="setting-item">
              <label>{t('language') || 'Language'}</label>
              <select value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="ta">🇮🇳 தமிழ்</option>
                <option value="te">🇮🇳 తెలుగు</option>
                <option value="bn">🇧🇩 বাংলা</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="nl">🇳🇱 Nederlands</option>
                <option value="pt">🇵🇹 Português</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ko">🇰🇷 한국어</option>
                <option value="ar">🇸🇦 العربية</option>
                <option value="ur">🇵🇰 اردو</option>
                <option value="id">🇮🇩 Bahasa</option>
              </select>
            </div>
            <div className="setting-item">
              <label>{t('currency') || 'Currency'}</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
            </div>
          </div>

          {/* Display Settings */}
          <div className="settings-section">
            <h3>🎨 {t('displaySettings') || 'Display Settings'}</h3>
            <div className="setting-item">
              <label>{t('theme') || 'Theme'}</label>
              <select value={settings.theme} onChange={e => handleChange('theme', e.target.value)}>
                <option value="dark">{t('dark') || 'Dark'}</option>
                <option value="light">{t('light') || 'Light'}</option>
                <option value="auto">{t('auto') || 'Auto'}</option>
              </select>
            </div>
            <div className="setting-item">
              <label>{t('fontSize') || 'Font Size'}</label>
              <select value={settings.fontSize} onChange={e => handleChange('fontSize', e.target.value)}>
                <option value="small">{t('small') || 'Small'}</option>
                <option value="medium">{t('medium') || 'Medium'}</option>
                <option value="large">{t('large') || 'Large'}</option>
              </select>
            </div>
            <div className="setting-item toggle">
              <label>{t('showPrices') || 'Show Prices'}</label>
              <input 
                type="checkbox" 
                checked={settings.showPrices} 
                onChange={e => handleChange('showPrices', e.target.checked)} 
              />
            </div>
          </div>

          {/* Booking Limitations */}
          <div className="settings-section">
            <h3>📋 {t('bookingLimitations') || 'Booking Limitations'}</h3>
            <div className="setting-item">
              <label>{t('maxGuests') || 'Max Guests Per Booking'}</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={settings.maxGuestsPerBooking}
                onChange={e => handleChange('maxGuestsPerBooking', parseInt(e.target.value))}
              />
            </div>
            <div className="setting-item">
              <label>{t('advanceBooking') || 'Advance Booking (Days)'}</label>
              <input 
                type="number" 
                min="7" 
                max="365" 
                value={settings.advanceBookingDays}
                onChange={e => handleChange('advanceBookingDays', parseInt(e.target.value))}
              />
            </div>
            <div className="setting-item">
              <label>{t('minNotice') || 'Minimum Notice (Days)'}</label>
              <input 
                type="number" 
                min="1" 
                max="30" 
                value={settings.minBookingNotice}
                onChange={e => handleChange('minBookingNotice', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Search Preferences */}
          <div className="settings-section">
            <h3>🔍 {t('searchPreferences') || 'Search Preferences'}</h3>
            <div className="setting-item">
              <label>{t('defaultSort') || 'Default Sort'}</label>
              <select value={settings.defaultSort} onChange={e => handleChange('defaultSort', e.target.value)}>
                <option value="rating">{t('highestRated') || 'Highest Rated'}</option>
                <option value="price-low">{t('priceLowToHigh') || 'Price: Low to High'}</option>
                <option value="price-high">{t('priceHighToLow') || 'Price: High to Low'}</option>
                <option value="duration">{t('duration') || 'Duration'}</option>
              </select>
            </div>
            <div className="setting-item">
              <label>{t('priceRangeMin') || 'Min Price'} ($)</label>
              <input 
                type="number" 
                min="0" 
                max={settings.priceRange.max - 100}
                value={settings.priceRange.min}
                onChange={e => handlePriceRangeChange('min', e.target.value)}
              />
            </div>
            <div className="setting-item">
              <label>{t('priceRangeMax') || 'Max Price'} ($)</label>
              <input 
                type="number" 
                min={settings.priceRange.min + 100}
                max="10000"
                value={settings.priceRange.max}
                onChange={e => handlePriceRangeChange('max', e.target.value)}
              />
            </div>
            <div className="setting-item toggle">
              <label>{t('showOnlyAvailable') || 'Show Only Available Tours'}</label>
              <input 
                type="checkbox" 
                checked={settings.showOnlyAvailable} 
                onChange={e => handleChange('showOnlyAvailable', e.target.checked)} 
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <h3>🔔 {t('notifications') || 'Notifications'}</h3>
            <div className="setting-item toggle">
              <label>{t('emailNotifications') || 'Email Notifications'}</label>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications} 
                onChange={e => handleChange('emailNotifications', e.target.checked)} 
              />
            </div>
            <div className="setting-item toggle">
              <label>{t('smsNotifications') || 'SMS Notifications'}</label>
              <input 
                type="checkbox" 
                checked={settings.smsNotifications} 
                onChange={e => handleChange('smsNotifications', e.target.checked)} 
              />
            </div>
            <div className="setting-item toggle">
              <label>{t('promotionalEmails') || 'Promotional Emails'}</label>
              <input 
                type="checkbox" 
                checked={settings.promotionalEmails} 
                onChange={e => handleChange('promotionalEmails', e.target.checked)} 
              />
            </div>
            <div className="setting-item toggle">
              <label>{t('bookingReminders') || 'Booking Reminders'}</label>
              <input 
                type="checkbox" 
                checked={settings.bookingReminders} 
                onChange={e => handleChange('bookingReminders', e.target.checked)} 
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="settings-section">
            <h3>🔒 {t('privacy') || 'Privacy'}</h3>
            <div className="setting-item toggle">
              <label>{t('shareData') || 'Share Usage Data'}</label>
              <input 
                type="checkbox" 
                checked={settings.shareData} 
                onChange={e => handleChange('shareData', e.target.checked)} 
              />
            </div>
            <div className="setting-item toggle">
              <label>{t('locationAccess') || 'Location Access'}</label>
              <input 
                type="checkbox" 
                checked={settings.locationAccess} 
                onChange={e => handleChange('locationAccess', e.target.checked)} 
              />
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="reset-btn" onClick={resetSettings}>
            🔄 {t('resetDefaults') || 'Reset to Defaults'}
          </button>
          <button className="save-btn" onClick={onClose}>
            ✓ {t('done') || 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
