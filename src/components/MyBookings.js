import React, { useState, useEffect } from 'react';
import './MyBookings.css';
import { useLanguage } from '../context/LanguageContext';
import { getBookings } from '../services/api';

function MyBookings({ user, onClose }) {
  const { t, formatPrice } = useLanguage();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await getBookings();
        const allBookings = response.data || [];
        const userBookings = allBookings.filter(b => b.email === user?.email);
        const savedBookings = localStorage.getItem(`bookings_${user?.email}`);
        const localBookings = savedBookings ? JSON.parse(savedBookings) : [];
        const merged = [...userBookings];
        localBookings.forEach(lb => {
          if (!merged.find(b => b.bookingId === lb.bookingId || b._id === lb.bookingId)) {
            merged.push(lb);
          }
        });
        setBookings(merged);
      } catch (error) {
        const savedBookings = localStorage.getItem(`bookings_${user?.email}`);
        if (savedBookings) {
          setBookings(JSON.parse(savedBookings));
        }
      }
    };
    loadBookings();
  }, [user]);

  const getBookingStatus = (booking) => {
    // Check admin status first
    if (booking.status === 'pending') return 'pending';
    if (booking.status === 'cancelled') return 'cancelled';
    if (booking.status === 'confirmed') {
      const tourDate = new Date(booking.date);
      const today = new Date();
      if (tourDate < today) return 'completed';
      if (tourDate.toDateString() === today.toDateString()) return 'today';
      return 'confirmed';
    }
    // Default based on date
    const tourDate = new Date(booking.date);
    const today = new Date();
    if (tourDate < today) return 'completed';
    return 'pending';
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
              {bookings.map((booking, index) => {
                const status = getBookingStatus(booking);
                return (
                  <div key={index} className={`booking-card ${status}`}>
                    <div className="booking-image">
                      <img src={booking.tourImage || booking.tour?.image} alt={booking.tourName || booking.tour?.name} />
                      <span className={`booking-status ${status}`}>
                        {status === 'pending' && '⏳ Pending Approval'}
                        {status === 'confirmed' && '✅ Confirmed'}
                        {status === 'cancelled' && '❌ Cancelled'}
                        {status === 'completed' && '✓ Completed'}
                        {status === 'today' && '📍 Today'}
                      </span>
                    </div>
                    <div className="booking-details">
                      <h4 className="booking-tour-name">{booking.tourName || booking.tour?.name}</h4>
                      <p className="booking-location">📍 {booking.tourLocation || booking.tour?.location}</p>
                      <div className="booking-info-row">
                        <span>📅 {formatDate(booking.date)}</span>
                        <span>👥 {booking.guests} {t('guests') || 'Guests'}</span>
                      </div>
                      <div className="booking-price">
                        <span>{t('total') || 'Total'}:</span>
                        <span className="price-value">{formatPrice(booking.totalPrice)}</span>
                      </div>
                      {status === 'pending' && (
                        <p className="pending-note">⏳ Awaiting admin approval. You'll receive an email once confirmed.</p>
                      )}
                      {status === 'cancelled' && (
                        <p className="cancelled-note">❌ This booking was cancelled by admin.</p>
                      )}
                    </div>
                  </div>
                );
              })}
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
