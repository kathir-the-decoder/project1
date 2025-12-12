import React, { useState, useEffect } from 'react';
import './MyBookings.css';
import { useLanguage } from '../context/LanguageContext';

function MyBookings({ user, onClose }) {
  const { t, formatPrice } = useLanguage();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem(`bookings_${user?.email}`);
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, [user]);

  const getStatusColor = (date) => {
    const tourDate = new Date(date);
    const today = new Date();
    if (tourDate < today) return 'completed';
    if (tourDate.toDateString() === today.toDateString()) return 'today';
    return 'upcoming';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="mybookings-overlay" onClick={onClose}>
      <div className="mybookings-modal" onClick={e => e.stopPropagation()}>
        <div className="mybookings-header">
          <h2>📋 {t('myBookings') || 'My Bookings'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="mybookings-content">
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <span className="no-bookings-icon">🎫</span>
              <h3>{t('noBookings') || 'No Bookings Yet'}</h3>
              <p>{t('noBookingsDesc') || 'Your booked tours will appear here. Start exploring and book your dream vacation!'}</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking, index) => (
                <div key={index} className={`booking-card ${getStatusColor(booking.date)}`}>
                  <div className="booking-image">
                    <img src={booking.tourImage} alt={booking.tourName} />
                    <span className={`booking-status ${getStatusColor(booking.date)}`}>
                      {getStatusColor(booking.date) === 'completed' ? '✓ Completed' : 
                       getStatusColor(booking.date) === 'today' ? '📍 Today' : '🗓️ Upcoming'}
                    </span>
                  </div>
                  <div className="booking-details">
                    <h4 className="booking-tour-name">{booking.tourName}</h4>
                    <p className="booking-location">📍 {booking.tourLocation}</p>
                    <div className="booking-info-row">
                      <span>📅 {formatDate(booking.date)}</span>
                      <span>👥 {booking.guests} {t('guests') || 'Guests'}</span>
                    </div>
                    <div className="booking-price">
                      <span>{t('total') || 'Total'}:</span>
                      <span className="price-value">{formatPrice(booking.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mybookings-footer">
          <button className="mybookings-close-btn" onClick={onClose}>
            {t('close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
