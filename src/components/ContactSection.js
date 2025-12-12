import React, { useState } from 'react';
import './ContactSection.css';
import { createEnquiry } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createEnquiry(formData);
      alert(t('enquirySuccess'));
      setFormData({ name: '', email: '', phone: '', destination: '', message: '' });
    } catch (error) {
      alert(t('enquiryFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <span className="section-badge">📞 {t('getInTouch')}</span>
          <h2>{t('planDreamVacation')}</h2>
          <p>{t('contactHelpText')}</p>

          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>{t('visitUs')}</h4>
                <p>123 Travel Street, Mumbai, India</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>{t('callUs')}</h4>
                <p>+91 90809 01058</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <h4>{t('emailUs')}</h4>
                <p>info@tourexplorer.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">⏰</span>
              <div>
                <h4>{t('workingHours')}</h4>
                <p>{t('supportAvailable')}</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a href="#" className="social-btn">📘 Facebook</a>
            <a href="#" className="social-btn">📸 Instagram</a>
            <a href="#" className="social-btn">🐦 Twitter</a>
            <a href="#" className="social-btn">▶️ YouTube</a>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <h3>{t('sendEnquiry')}</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('yourName')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={t('enterName')}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('phoneNumber')} *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t('emailAddress')} *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder={t('enterEmail')}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('preferredDestination')}</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              >
                <option value="">{t('selectDestination')}</option>
                <option value="dubai">Dubai</option>
                <option value="bali">Bali</option>
                <option value="maldives">Maldives</option>
                <option value="singapore">Singapore</option>
                <option value="thailand">Thailand</option>
                <option value="europe">Europe</option>
                <option value="india">India</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('yourMessage')}</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder={t('tellTravelPlans')}
                rows="4"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? t('sending') : t('sendEnquiryBtn')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
