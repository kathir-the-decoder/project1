import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { useLanguage } from '../context/LanguageContext';

function Navbar({ user, onLogout, onLoginClick, onSettingsClick, onProfileClick, onMyBookingsClick, onPaymentsClick }) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionClass) => {
    document.querySelector(sectionClass)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-brand">
          <span className="brand-icon">✈️</span>
          <div className="brand-text">
            <span className="brand-name">{t('brandName')}</span>
            <span className="brand-tagline">{t('brandTagline')}</span>
          </div>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <button className="nav-link" onClick={() => scrollToSection('.hero')}>{t('home')}</button>
          <button className="nav-link" onClick={() => scrollToSection('.categories-section')}>{t('categoriesNav')}</button>
          <button className="nav-link" onClick={() => scrollToSection('.tours-section')}>{t('toursNav')}</button>
          <button className="nav-link" onClick={() => scrollToSection('.features-section')}>{t('aboutNav')}</button>
          <button className="nav-link" onClick={() => scrollToSection('.contact-section')}>{t('contactNav')}</button>
        </div>

        <div className="navbar-actions">
          <a href="tel:+919080901058" className="phone-btn">
            <span className="phone-icon">📞</span>
            <span className="phone-number">+91 90809 01058</span>
          </a>
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <div className="user-info" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
                <span className="dropdown-arrow">{showUserDropdown ? '▲' : '▼'}</span>
              </div>
              {showUserDropdown && (
                <div className="user-dropdown">
                  {/* Header Section */}
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <div className="dropdown-user-info">
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  {/* Account Section */}
                  <div className="dropdown-item" onClick={() => { onProfileClick && onProfileClick(); setShowUserDropdown(false); }}>
                    <span className="dropdown-icon">👤</span>
                    <span>{t('profile') || 'Profile'}</span>
                  </div>
                  <div className="dropdown-item" onClick={() => { onMyBookingsClick && onMyBookingsClick(); setShowUserDropdown(false); }}>
                    <span className="dropdown-icon">📋</span>
                    <span>{t('myBookings') || 'My Bookings'}</span>
                  </div>
                  <div className="dropdown-item" onClick={() => { onPaymentsClick && onPaymentsClick(); setShowUserDropdown(false); }}>
                    <span className="dropdown-icon">💳</span>
                    <span>{t('payments') || 'Payments & Rewards'}</span>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  {/* Settings & Help */}
                  <div className="dropdown-item" onClick={() => { onSettingsClick && onSettingsClick(); setShowUserDropdown(false); }}>
                    <span className="dropdown-icon">⚙️</span>
                    <span>{t('settings') || 'Settings'}</span>
                  </div>
                  <div className="dropdown-item">
                    <span className="dropdown-icon">❓</span>
                    <span>{t('help') || 'Help'}</span>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  {/* Sign Out */}
                  <div className="dropdown-item logout" onClick={() => { onLogout(); setShowUserDropdown(false); }}>
                    <span className="dropdown-icon">🚪</span>
                    <span>{t('logout') || 'Sign out'}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onLoginClick} className="login-btn">
              {t('signIn')}
            </button>
          )}
          <button className="settings-btn" onClick={onSettingsClick} title={t('settings') || 'Settings'}>
            ⋮
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
