import React from 'react';
import './TourDetailsModal.css';
import { useLanguage } from '../context/LanguageContext';

function TourDetailsModal({ tour, onClose }) {
  const { t, formatPrice } = useLanguage();

  if (!tour) return null;

  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="details-header">
          <img src={tour.image} alt={tour.name} className="details-image" />
          <div className="details-meta">
            <h2>{tour.name}</h2>
            <p className="details-location">📍 {tour.location}</p>
            <p className="details-rating">⭐ {tour.rating} • {tour.duration} • {t('max')} {tour.maxGroupSize}</p>
            <p className="details-price">{t('from')} {formatPrice(tour.price)}</p>
          </div>
        </div>

        <div className="details-body">
          <h3>{t('aboutThisTour')}</h3>
          <p>{tour.description}</p>

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
