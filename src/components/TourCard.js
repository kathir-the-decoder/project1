import React from 'react';
import './TourCard.css';
import { useLanguage } from '../context/LanguageContext';

function TourCard({ tour, onBook, onView, id }) {
  const { t, formatPrice } = useLanguage();

  return (
    <div className="tour-card" id={id} onClick={() => onView && onView(tour)}>
      <img src={tour.image} alt={tour.name} className="tour-image" />
      <div className="tour-content">
        <div className="tour-header">
          <h2>{tour.name}</h2>
          <span className="tour-rating">⭐ {tour.rating}</span>
        </div>
        <p className="tour-location">📍 {tour.location}</p>
        <p className="tour-description">{tour.description}</p>
        <div className="tour-details">
          <span className="duration">⏱️ {tour.duration}</span>
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
