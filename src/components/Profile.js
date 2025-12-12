import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useLanguage } from '../context/LanguageContext';

function Profile({ user, onClose, onUpdateUser }) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [profileData, setProfileData] = useState({
    phone: '',
    location: 'India',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      // Load saved profile data from localStorage
      const savedProfile = localStorage.getItem(`profile_${user.email}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData(parsed);
        setFormData({
          name: user.name,
          phone: parsed.phone || '',
          location: parsed.location || 'India',
          bio: parsed.bio || ''
        });
      } else {
        setFormData({
          name: user.name,
          phone: '',
          location: 'India',
          bio: ''
        });
      }
    }
  }, [user]);

  if (!user) return null;

  const memberSince = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  // Get bookings count from localStorage
  const bookings = JSON.parse(localStorage.getItem(`bookings_${user.email}`) || '[]');
  const points = parseInt(localStorage.getItem(`points_${user.email}`) || '0');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save profile data to localStorage
    const newProfileData = {
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio
    };
    localStorage.setItem(`profile_${user.email}`, JSON.stringify(newProfileData));
    setProfileData(newProfileData);

    // Update user name if changed
    if (formData.name !== user.name && onUpdateUser) {
      const updatedUser = { ...user, name: formData.name };
      onUpdateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: profileData.phone || '',
      location: profileData.location || 'India',
      bio: profileData.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>×</button>
        
        {/* Profile Header with Background */}
        <div className="profile-banner">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {(isEditing ? formData.name : user.name).charAt(0).toUpperCase()}
            </div>
            <div className="profile-status online"></div>
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="profile-edit-form">
            <h3 className="edit-title">✏️ {t('editProfile') || 'Edit Profile'}</h3>
            
            <div className="edit-form-group">
              <label>{t('fullName') || 'Full Name'}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="edit-form-group">
              <label>{t('phone') || 'Phone Number'}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="edit-form-group">
              <label>{t('location') || 'Location'}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>

            <div className="edit-form-group">
              <label>{t('bio') || 'Bio'}</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows="3"
              />
            </div>

            <div className="edit-actions">
              <button className="edit-btn cancel" onClick={handleCancel}>
                {t('cancel') || 'Cancel'}
              </button>
              <button className="edit-btn save" onClick={handleSave}>
                ✓ {t('save') || 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <>
            {/* User Info */}
            <div className="profile-info">
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
              {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
              <span className="profile-badge">
                {user.role === 'admin' ? '👑 Admin' : '✈️ Traveler'}
              </span>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{bookings.length}</span>
                <span className="stat-label">{t('trips') || 'Trips'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">{t('reviews') || 'Reviews'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{points}</span>
                <span className="stat-label">{t('points') || 'Points'}</span>
              </div>
            </div>

            {/* Details */}
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-icon">📧</span>
                <div className="detail-content">
                  <span className="detail-label">{t('email') || 'Email'}</span>
                  <span className="detail-value">{user.email}</span>
                </div>
              </div>

              {profileData.phone && (
                <div className="detail-row">
                  <span className="detail-icon">📱</span>
                  <div className="detail-content">
                    <span className="detail-label">{t('phone') || 'Phone'}</span>
                    <span className="detail-value">{profileData.phone}</span>
                  </div>
                </div>
              )}
              
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <div className="detail-content">
                  <span className="detail-label">{t('location') || 'Location'}</span>
                  <span className="detail-value">{profileData.location || 'India'}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <span className="detail-icon">📅</span>
                <div className="detail-content">
                  <span className="detail-label">{t('memberSince') || 'Member Since'}</span>
                  <span className="detail-value">{memberSince}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <span className="detail-icon">🎫</span>
                <div className="detail-content">
                  <span className="detail-label">{t('accountType') || 'Account Type'}</span>
                  <span className="detail-value">{user.role === 'admin' ? 'Administrator' : 'Standard'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <button className="profile-btn edit" onClick={() => setIsEditing(true)}>
                ✏️ {t('editProfile') || 'Edit Profile'}
              </button>
              <button className="profile-btn close" onClick={onClose}>
                {t('close') || 'Close'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
