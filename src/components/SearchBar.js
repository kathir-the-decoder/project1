import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { useLanguage } from '../context/LanguageContext';

function SearchBar({ onSearch, onFilter, tours = [], onSelectTour }) {
  const { t, currency } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const formatPrice = (price) => {
    const rates = { USD: 1, INR: 83, EUR: 0.92, GBP: 0.79 };
    const convertedPrice = Math.round(price * rates[currency]);
    
    switch (currency) {
      case 'INR': return `₹${convertedPrice.toLocaleString('en-IN')}`;
      case 'EUR': return `€${convertedPrice.toLocaleString('de-DE')}`;
      case 'GBP': return `£${convertedPrice.toLocaleString('en-GB')}`;
      default: return `$${price.toLocaleString('en-US')}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Region/country keyword mappings
  const regionKeywords = {
    'america': ['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Peru', 'Costa Rica', 'Cuba', 'Jamaica', 'Colombia', 'Chile', 'Ecuador'],
    'usa': ['USA', 'New York', 'Las Vegas', 'Hawaii', 'San Francisco', 'Miami', 'Arizona', 'Alaska'],
    'europe': ['France', 'Italy', 'Spain', 'UK', 'Germany', 'Netherlands', 'Greece', 'Portugal', 'Austria', 'Switzerland', 'Iceland', 'Norway', 'Sweden', 'Denmark', 'Belgium', 'Poland', 'Hungary', 'Croatia', 'Czech', 'Ireland', 'Scotland'],
    'asia': ['Japan', 'Thailand', 'Indonesia', 'Singapore', 'Vietnam', 'Malaysia', 'Philippines', 'China', 'South Korea', 'Hong Kong', 'Cambodia', 'Sri Lanka', 'Nepal'],
    'africa': ['Kenya', 'South Africa', 'Morocco', 'Egypt', 'Tanzania', 'Zambia', 'Rwanda', 'Mauritius', 'Seychelles', 'Tunisia', 'Madagascar'],
    'oceania': ['Australia', 'New Zealand', 'Fiji', 'Tahiti', 'Samoa'],
    'middle east': ['UAE', 'Dubai', 'Jordan', 'Israel', 'Oman', 'Qatar', 'Abu Dhabi'],
    'india': ['India', 'Delhi', 'Goa', 'Kerala', 'Rajasthan', 'Jaipur', 'Varanasi'],
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);

    if (value.trim().length > 0) {
      const searchLower = value.toLowerCase();
      
      const filtered = tours.filter(tour => {
        const nameMatch = tour.name.toLowerCase().includes(searchLower);
        const locationMatch = tour.location.toLowerCase().includes(searchLower);
        const descMatch = tour.description?.toLowerCase().includes(searchLower);
        
        // Check region keywords
        let regionMatch = false;
        for (const [region, countries] of Object.entries(regionKeywords)) {
          if (searchLower.includes(region)) {
            regionMatch = countries.some(country => 
              tour.location.toLowerCase().includes(country.toLowerCase())
            );
            if (regionMatch) break;
          }
        }

        return nameMatch || locationMatch || descMatch || regionMatch;
      }).slice(0, 6);
      
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (tour) => {
    setSearchTerm(tour.name);
    setShowDropdown(false);
    onSearch(tour.name);
    if (onSelectTour) {
      onSelectTour(tour);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper" ref={searchRef}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && suggestions.length > 0 && setShowDropdown(true)}
          className="search-input"
        />
        
        {showDropdown && suggestions.length > 0 && (
          <div className="search-dropdown">
            {suggestions.map((tour) => (
              <div
                key={tour.id}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(tour)}
              >
                <img src={tour.image} alt={tour.name} className="suggestion-image" />
                <div className="suggestion-info">
                  <h4 className="suggestion-name">{tour.name}</h4>
                  <p className="suggestion-location">📍 {tour.location}</p>
                  <div className="suggestion-meta">
                    <span className="suggestion-rating">⭐ {tour.rating}</span>
                    <span className="suggestion-duration">⏱️ {tour.duration}</span>
                    <span className="suggestion-price">{formatPrice(tour.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <select onChange={(e) => onFilter(e.target.value)} className="filter-select">
        <option value="all">{t('allTours')}</option>
        <option value="price-low">{t('priceLowToHigh')}</option>
        <option value="price-high">{t('priceHighToLow')}</option>
        <option value="rating">{t('highestRated')}</option>
        <option value="duration">{t('duration')}</option>
      </select>
    </div>
  );
}

export default SearchBar;
