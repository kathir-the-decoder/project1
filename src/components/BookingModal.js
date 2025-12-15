import React, { useState, useMemo } from 'react';
import './BookingModal.css';
import { useLanguage } from '../context/LanguageContext';

function BookingModal({ tour, onClose, onConfirm }) {
  const { t, formatPrice, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: 1,
  });

  const [customizations, setCustomizations] = useState({
    roomType: 'standard',
    mealPlan: 'breakfast',
    transport: 'shared',
    insurance: false,
    photography: false,
    privateGuide: false,
    airportTransfer: false,
    spaPackage: false,
    adventureActivities: [],
    specialRequests: '',
  });

  const addOns = {
    roomTypes: [
      { id: 'standard', name: t('standardRoom') || 'Standard Room', price: 0 },
      { id: 'deluxe', name: t('deluxeRoom') || 'Deluxe Room', price: 50 },
      { id: 'suite', name: t('suiteRoom') || 'Suite', price: 120 },
      { id: 'villa', name: t('villaRoom') || 'Private Villa', price: 250 },
    ],
    mealPlans: [
      { id: 'breakfast', name: t('breakfastOnly') || 'Breakfast Only', price: 0 },
      { id: 'halfBoard', name: t('halfBoard') || 'Half Board (B+D)', price: 30 },
      { id: 'fullBoard', name: t('fullBoard') || 'Full Board (B+L+D)', price: 55 },
      { id: 'allInclusive', name: t('allInclusive') || 'All Inclusive', price: 85 },
    ],
    transportOptions: [
      { id: 'shared', name: t('sharedTransport') || 'Shared Transport', price: 0 },
      { id: 'private', name: t('privateTransport') || 'Private Vehicle', price: 80 },
      { id: 'luxury', name: t('luxuryTransport') || 'Luxury Vehicle', price: 150 },
    ],
    extras: [
      { id: 'insurance', name: t('travelInsurance') || 'Travel Insurance', price: 25, icon: '🛡️' },
      { id: 'photography', name: t('photoPackage') || 'Photography Package', price: 75, icon: '📸' },
      { id: 'privateGuide', name: t('privateGuide') || 'Private Guide', price: 60, icon: '🎯' },
      { id: 'airportTransfer', name: t('airportTransfer') || 'Airport Transfer', price: 40, icon: '✈️' },
      { id: 'spaPackage', name: t('spaPackage') || 'Spa & Wellness', price: 90, icon: '💆' },
    ],
    activities: [
      { id: 'snorkeling', name: t('snorkeling') || 'Snorkeling', price: 35, icon: '🤿' },
      { id: 'hiking', name: t('hiking') || 'Guided Hiking', price: 40, icon: '🥾' },
      { id: 'cooking', name: t('cookingClass') || 'Cooking Class', price: 45, icon: '👨‍🍳' },
      { id: 'cultural', name: t('culturalTour') || 'Cultural Tour', price: 30, icon: '🏛️' },
      { id: 'sunset', name: t('sunsetCruise') || 'Sunset Cruise', price: 55, icon: '🌅' },
      { id: 'wildlife', name: t('wildlifeSafari') || 'Wildlife Safari', price: 70, icon: '🦁' },
    ],
  };

  const calculateTotal = useMemo(() => {
    let total = tour.price * formData.guests;
    
    // Room upgrade
    const room = addOns.roomTypes.find(r => r.id === customizations.roomType);
    if (room) total += room.price * formData.guests;
    
    // Meal plan
    const meal = addOns.mealPlans.find(m => m.id === customizations.mealPlan);
    if (meal) total += meal.price * formData.guests;
    
    // Transport
    const transport = addOns.transportOptions.find(t => t.id === customizations.transport);
    if (transport) total += transport.price;
    
    // Extras
    addOns.extras.forEach(extra => {
      if (customizations[extra.id]) total += extra.price;
    });
    
    // Activities
    customizations.adventureActivities.forEach(actId => {
      const activity = addOns.activities.find(a => a.id === actId);
      if (activity) total += activity.price * formData.guests;
    });
    
    return total;
  }, [tour.price, formData.guests, customizations, addOns]);

  const [guestError, setGuestError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate email
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('❌ Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
    
    // Validate guests
    if (name === 'guests') {
      const numGuests = parseInt(value) || 0;
      if (numGuests > tour.maxGroupSize) {
        setGuestError(`❌ Maximum ${tour.maxGroupSize} guests allowed for this tour`);
      } else if (numGuests < 1) {
        setGuestError('❌ At least 1 guest is required');
      } else {
        setGuestError('');
      }
    }
    
    // Validate phone (10 digits)
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (value && digitsOnly.length < 10) {
        setPhoneError('❌ Phone number must be at least 10 digits');
      } else if (digitsOnly.length > 15) {
        setPhoneError('❌ Phone number is too long');
      } else {
        setPhoneError('');
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const isEmailValid = () => {
    return formData.email && validateEmail(formData.email);
  };

  const isGuestValid = () => {
    const numGuests = parseInt(formData.guests) || 0;
    return numGuests >= 1 && numGuests <= tour.maxGroupSize;
  };

  const isPhoneValid = () => {
    const digitsOnly = formData.phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const handleCustomizationChange = (key, value) => {
    setCustomizations({ ...customizations, [key]: value });
  };

  const toggleActivity = (activityId) => {
    const activities = customizations.adventureActivities.includes(activityId)
      ? customizations.adventureActivities.filter(id => id !== activityId)
      : [...customizations.adventureActivities, activityId];
    setCustomizations({ ...customizations, adventureActivities: activities });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ ...formData, tour, customizations, totalPrice: calculateTotal });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>🎫 {t('book') || 'Book'} {(tour.translations && tour.translations[language] && tour.translations[language].name) || tour.name}</h2>
          <div className="booking-steps">
            <span className={`step ${step >= 1 ? 'active' : ''}`}>1. {t('details') || 'Details'}</span>
            <span className={`step ${step >= 2 ? 'active' : ''}`}>2. {t('customize') || 'Customize'}</span>
            <span className={`step ${step >= 3 ? 'active' : ''}`}>3. {t('confirm') || 'Confirm'}</span>
          </div>
        </div>

        <div className="price-summary">
          <span>{t('total') || 'Total'}:</span>
          <span className="total-price">{formatPrice(calculateTotal)}</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="step-content">
              <h3>📋 {t('basicDetails') || 'Basic Details'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('fullName') || 'Full Name'} *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                </div>
                <div className="form-group">
                  <label>{t('email') || 'Email'} *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. name@example.com"
                    className={emailError ? 'input-error' : ''}
                  />
                  {emailError && <span className="error-message">{emailError}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('phone') || 'Phone'} *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. 9876543210"
                    className={phoneError ? 'input-error' : ''}
                  />
                  <small>{t('phoneHint') || 'Enter 10-digit mobile number'}</small>
                  {phoneError && <span className="error-message">{phoneError}</span>}
                </div>
                <div className="form-group">
                  <label>{t('tourDate') || 'Tour Date'} *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required 
                    min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="form-group">
                <label>{t('numberOfGuests') || 'Number of Guests'} *</label>
                <input 
                  type="number" 
                  name="guests" 
                  min="1" 
                  max={tour.maxGroupSize} 
                  value={formData.guests} 
                  onChange={handleChange} 
                  required 
                  className={guestError ? 'input-error' : ''}
                />
                <small>{t('maxGuestsPerBooking') || 'Max Guests Per Booking'}: {tour.maxGroupSize} {t('guests') || 'guests'}</small>
                {guestError && <span className="error-message">{guestError}</span>}
              </div>
              <button type="button" className="next-btn" onClick={() => setStep(2)}
                disabled={!formData.name || !formData.email || !formData.phone || !formData.date || !isGuestValid() || !isPhoneValid() || !isEmailValid()}>
                {t('next') || 'Next'} →
              </button>
            </div>
          )}

          {/* Step 2: Customizations */}
          {step === 2 && (
            <div className="step-content">
              <h3>✨ {t('customizePackage') || 'Customize Your Package'}</h3>
              
              {/* Room Type */}
              <div className="customize-section">
                <h4>🏨 {t('roomType') || 'Room Type'}</h4>
                <div className="option-cards">
                  {addOns.roomTypes.map(room => (
                    <div key={room.id} 
                      className={`option-card ${customizations.roomType === room.id ? 'selected' : ''}`}
                      onClick={() => handleCustomizationChange('roomType', room.id)}>
                      <span className="option-name">{room.name}</span>
                      <span className="option-price">{room.price > 0 ? `+${formatPrice(room.price)}` : t('included') || 'Included'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal Plan */}
              <div className="customize-section">
                <h4>🍽️ {t('mealPlan') || 'Meal Plan'}</h4>
                <div className="option-cards">
                  {addOns.mealPlans.map(meal => (
                    <div key={meal.id}
                      className={`option-card ${customizations.mealPlan === meal.id ? 'selected' : ''}`}
                      onClick={() => handleCustomizationChange('mealPlan', meal.id)}>
                      <span className="option-name">{meal.name}</span>
                      <span className="option-price">{meal.price > 0 ? `+${formatPrice(meal.price)}` : t('included') || 'Included'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div className="customize-section">
                <h4>🚗 {t('transport') || 'Transport'}</h4>
                <div className="option-cards">
                  {addOns.transportOptions.map(opt => (
                    <div key={opt.id}
                      className={`option-card ${customizations.transport === opt.id ? 'selected' : ''}`}
                      onClick={() => handleCustomizationChange('transport', opt.id)}>
                      <span className="option-name">{opt.name}</span>
                      <span className="option-price">{opt.price > 0 ? `+${formatPrice(opt.price)}` : t('included') || 'Included'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Services */}
              <div className="customize-section">
                <h4>🎁 {t('extraServices') || 'Extra Services'}</h4>
                <div className="extras-grid">
                  {addOns.extras.map(extra => (
                    <div key={extra.id}
                      className={`extra-card ${customizations[extra.id] ? 'selected' : ''}`}
                      onClick={() => handleCustomizationChange(extra.id, !customizations[extra.id])}>
                      <span className="extra-icon">{extra.icon}</span>
                      <span className="extra-name">{extra.name}</span>
                      <span className="extra-price">+{formatPrice(extra.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="customize-section">
                <h4>🎯 {t('activities') || 'Activities'}</h4>
                <div className="extras-grid">
                  {addOns.activities.map(activity => (
                    <div key={activity.id}
                      className={`extra-card ${customizations.adventureActivities.includes(activity.id) ? 'selected' : ''}`}
                      onClick={() => toggleActivity(activity.id)}>
                      <span className="extra-icon">{activity.icon}</span>
                      <span className="extra-name">{activity.name}</span>
                      <span className="extra-price">+{formatPrice(activity.price)}/person</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="customize-section">
                <h4>📝 {t('specialRequests') || 'Special Requests'}</h4>
                <textarea 
                  placeholder={t('specialRequestsPlaceholder') || 'Any dietary requirements, accessibility needs, or special occasions...'}
                  value={customizations.specialRequests}
                  onChange={(e) => handleCustomizationChange('specialRequests', e.target.value)}
                />
              </div>

              <div className="step-buttons">
                <button type="button" className="back-btn" onClick={() => setStep(1)}>← {t('back') || 'Back'}</button>
                <button type="button" className="next-btn" onClick={() => setStep(3)}>{t('next') || 'Next'} →</button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="step-content">
              <h3>✅ {t('confirmDetails') || 'Confirm Your Booking'}</h3>
              
              <div className="summary-card">
                <div className="summary-section">
                  <h4>{t('tourDetails') || 'Tour Details'}</h4>
                  <p><strong>{tour.name}</strong></p>
                  <p>📍 {tour.location}</p>
                  <p>⏱️ {tour.duration}</p>
                </div>

                <div className="summary-section">
                  <h4>{t('bookingDetails') || 'Booking Details'}</h4>
                  <p>👤 {formData.name}</p>
                  <p>📧 {formData.email}</p>
                  <p>📞 {formData.phone}</p>
                  <p>📅 {formData.date}</p>
                  <p>👥 {formData.guests} {t('guests') || 'guests'}</p>
                </div>

                <div className="summary-section">
                  <h4>{t('selectedOptions') || 'Selected Options'}</h4>
                  <p>🏨 {addOns.roomTypes.find(r => r.id === customizations.roomType)?.name}</p>
                  <p>🍽️ {addOns.mealPlans.find(m => m.id === customizations.mealPlan)?.name}</p>
                  <p>🚗 {addOns.transportOptions.find(t => t.id === customizations.transport)?.name}</p>
                  {addOns.extras.filter(e => customizations[e.id]).map(e => (
                    <p key={e.id}>{e.icon} {e.name}</p>
                  ))}
                  {customizations.adventureActivities.map(actId => {
                    const act = addOns.activities.find(a => a.id === actId);
                    return act ? <p key={actId}>{act.icon} {act.name}</p> : null;
                  })}
                </div>

                <div className="summary-total">
                  <span>{t('grandTotal') || 'Grand Total'}:</span>
                  <span className="grand-total">{formatPrice(calculateTotal)}</span>
                </div>
              </div>

              <div className="step-buttons">
                <button type="button" className="back-btn" onClick={() => setStep(2)}>← {t('back') || 'Back'}</button>
                <button type="submit" className="submit-btn">🎉 {t('confirmBooking') || 'Confirm Booking'}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
