import React from 'react';
import './TourCard.css';
import { useLanguage } from '../context/LanguageContext';

// Duration translations
const durationTranslations = {
  en: { days: 'days', day: 'day' },
  hi: { days: 'दिन', day: 'दिन' },
  ta: { days: 'நாட்கள்', day: 'நாள்' },
  es: { days: 'días', day: 'día' },
  fr: { days: 'jours', day: 'jour' },
  de: { days: 'Tage', day: 'Tag' },
  zh: { days: '天', day: '天' },
  ja: { days: '日間', day: '日' },
  ar: { days: 'أيام', day: 'يوم' },
  ru: { days: 'дней', day: 'день' },
  pt: { days: 'dias', day: 'dia' },
  bn: { days: 'দিন', day: 'দিন' },
};

function TourCard({ tour, onBook, onView, id }) {
  const { t, formatPrice, language } = useLanguage();

  // Translate duration (e.g., "3 days" -> "3 दिन")
  const translateDuration = (duration) => {
    if (!duration) return duration;
    const trans = durationTranslations[language] || durationTranslations.en;
    return duration
      .replace(/days/gi, trans.days)
      .replace(/day/gi, trans.day);
  };

  return (
    <div className="tour-card" id={id} onClick={() => onView && onView(tour)}>
      <img src={tour.image} alt={tour.name} className="tour-image" />
      <div className="tour-content">
        <div className="tour-header">
          <h2>{(tour.translations && tour.translations[language]?.name) || tour.name}</h2>
          <span className="tour-rating">⭐ {tour.rating}</span>
        </div>
        <p className="tour-location">📍 {(tour.translations && tour.translations[language]?.location) || tour.location}</p>
        <p className="tour-description">{(tour.translations && tour.translations[language]?.description) || tour.description}</p>
        <div className="tour-details">
          <span className="duration">⏱️ {translateDuration(tour.duration)}</span>
          <span className="group-size">👥 {t('max')} {tour.maxGroupSize}</span>
        </div>
        <div className="tour-footer">
          <div className="price-section">
            <span className="price-label">{t('from')}</span>
            <span className="price">{formatPrice(tour.price)}</span>
          </div>
          <button className="book-btn" onClick={(e) => { e.stopPropagation(); onBook(tour); }}>
            {t('bookNow')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TourCard;
