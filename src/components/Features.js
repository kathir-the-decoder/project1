import React from 'react';
import './Features.css';
import { useLanguage } from '../context/LanguageContext';

function Features() {
  const { t } = useLanguage();

  const features = [
    { icon: '💰', titleKey: 'featBestPrice', descKey: 'featBestPriceDesc' },
    { icon: '🛡️', titleKey: 'featSafe', descKey: 'featSafeDesc' },
    { icon: '🎯', titleKey: 'featHandpicked', descKey: 'featHandpickedDesc' },
    { icon: '📞', titleKey: 'featSupport', descKey: 'featSupportDesc' },
    { icon: '✈️', titleKey: 'featEasyBooking', descKey: 'featEasyBookingDesc' },
    { icon: '⭐', titleKey: 'featTrusted', descKey: 'featTrustedDesc' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      textKey: 'testimonial1'
    },
    {
      name: 'Rahul Verma',
      location: 'Delhi',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      textKey: 'testimonial2'
    },
    {
      name: 'Anita Patel',
      location: 'Bangalore',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      textKey: 'testimonial3'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="section-header">
          <span className="section-badge">✨ {t('whyTourExplorer')}</span>
          <h2 className="section-title">{t('whyTravelWithUs')}</h2>
          <p className="section-subtitle">{t('travelDreamsComeTrue')}</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.descKey)}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
          <div className="section-header">
            <span className="section-badge">💬 {t('testimonials')}</span>
            <h2 className="section-title">{t('whatTravelersSay')}</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="testimonial-header">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.location}</span>
                  </div>
                  <div className="testimonial-rating">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                </div>
                <p className="testimonial-text">"{t(testimonial.textKey)}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
