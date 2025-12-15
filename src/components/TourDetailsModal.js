import React from 'react';
import './TourDetailsModal.css';
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

function TourDetailsModal({ tour, onClose }) {
  const { t, formatPrice, language } = useLanguage();

  if (!tour) return null;

  // Translate duration
  const translateDuration = (duration) => {
    if (!duration) return duration;
    const trans = durationTranslations[language] || durationTranslations.en;
    return duration.replace(/days/gi, trans.days).replace(/day/gi, trans.day);
  };

  // Get translated content or fallback to original
  const getName = () => tour.translations?.[language]?.name || tour.name;
  const getLocation = () => tour.translations?.[language]?.location || tour.location;
  const getDescription = () => tour.translations?.[language]?.description || tour.description;

  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="details-header">
          <img src={tour.image} alt={getName()} className="details-image" />
          <div className="details-meta">
            <h2>{getName()}</h2>
            <p className="details-location">📍 {getLocation()}</p>
            <p className="details-rating">⭐ {tour.rating} • {translateDuration(tour.duration)} • {t('max')} {tour.maxGroupSize}</p>
            <p className="details-price">{t('from')} {formatPrice(tour.price)}</p>
          </div>
        </div>

        <div className="details-body">
          <h3>{t('aboutThisTour')}</h3>
          <p>{getDescription()}</p>

          {tour.features && (
            <div className="details-features">
              <h4>{t('highlights')}</h4>
              <ul>
                {tour.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default TourDetailsModal;
