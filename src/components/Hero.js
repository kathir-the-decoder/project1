import React, { useState } from 'react';
import './Hero.css';
import { useLanguage } from '../context/LanguageContext';

function Hero({ onSearch }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    // Scroll to tours section
    document.querySelector('.tours-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const popularDestinations = [
    { name: 'Dubai', icon: '🏙️' },
    { name: 'Bali', icon: '🏝️' },
    { name: 'Paris', icon: '🗼' },
    { name: 'Maldives', icon: '🌊' },
    { name: 'Singapore', icon: '🎡' },
    { name: 'Thailand', icon: '🛕' },
  ];

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-overlay"></div>
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-with-waves-1089-large.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-content">
        <div className="hero-badge">✈️ {t('heroBadge')}</div>
        <h1 className="hero-title">
          {t('heroMainTitle')}
          <span className="highlight"> {t('brandName')}</span>
        </h1>
        <p className="hero-subtitle">
          {t('heroDescription')}
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <div className="search-box">
            <input
              type="text"
              placeholder={t('heroSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">{t('searchBtn')}</button>
          </div>
        </form>

        <div className="popular-tags">
          <span className="tags-label">{t('popular')}:</span>
          {popularDestinations.map((dest, index) => (
            <button
              key={index}
              className="tag-btn"
              onClick={() => {
                setSearchQuery(dest.name);
                if (onSearch) onSearch(dest.name);
                document.querySelector('.tours-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {dest.icon} {dest.name}
            </button>
          ))}
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">100+</span>
            <span className="stat-label">{t('tourPackages')}</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">{t('destinations')}</span>
          </div>
          <div className="stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">{t('happyTravelers')}</span>
          </div>
          <div className="stat">
            <span className="stat-number">4.9</span>
            <span className="stat-label">{t('rating')} ⭐</span>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>{t('scrollToExplore')}</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
}

export default Hero;
