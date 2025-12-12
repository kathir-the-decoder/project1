import React, { useMemo } from 'react';
import './Categories.css';
import { useLanguage } from '../context/LanguageContext';

function Categories({ onCategorySelect, tours = [] }) {
  const { t } = useLanguage();
  
  // Calculate actual tour counts for each category
  const categoryCounts = useMemo(() => {
    if (!tours.length) return {};
    
    return {
      international: tours.filter(t => !t.location?.includes('India')).length,
      domestic: tours.filter(t => t.location?.includes('India')).length,
      honeymoon: tours.filter(t => 
        t.location?.includes('Maldives') || 
        t.location?.includes('Bali') || 
        t.location?.includes('Paris') ||
        t.location?.includes('Santorini') ||
        t.location?.includes('Venice') ||
        t.location?.includes('Tahiti') ||
        t.location?.includes('Seychelles') ||
        t.location?.includes('Mauritius')
      ).length,
      adventure: tours.filter(t => 
        t.name?.includes('Trek') || 
        t.name?.includes('Adventure') || 
        t.name?.includes('Safari') ||
        t.name?.includes('Thrill') ||
        t.location?.includes('Nepal') ||
        t.location?.includes('New Zealand') ||
        t.location?.includes('Alaska') ||
        t.name?.includes('Wilderness')
      ).length,
      beach: tours.filter(t => 
        t.name?.includes('Beach') || 
        t.name?.includes('Island') || 
        t.name?.includes('Paradise') ||
        t.name?.includes('Coast') ||
        t.location?.includes('Maldives') ||
        t.location?.includes('Bali') ||
        t.location?.includes('Phuket') ||
        t.location?.includes('Goa') ||
        t.location?.includes('Fiji') ||
        t.location?.includes('Hawaii') ||
        t.location?.includes('Cancun') ||
        t.location?.includes('Jamaica')
      ).length,
      pilgrimage: tours.filter(t => 
        t.location?.includes('Varanasi') || 
        t.name?.includes('Spiritual') ||
        t.name?.includes('Holy') ||
        t.name?.includes('Pilgrimage') ||
        t.location?.includes('Jerusalem') ||
        t.name?.includes('Temple')
      ).length,
    };
  }, [tours]);

  const categories = [
    {
      id: 'international',
      nameKey: 'catInternational',
      icon: '🌍',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
      descKey: 'catInternationalDesc'
    },
    {
      id: 'domestic',
      nameKey: 'catDomestic',
      icon: '🇮🇳',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
      descKey: 'catDomesticDesc'
    },
    {
      id: 'honeymoon',
      nameKey: 'catHoneymoon',
      icon: '💑',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
      descKey: 'catHoneymoonDesc'
    },
    {
      id: 'adventure',
      nameKey: 'catAdventure',
      icon: '🏔️',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
      descKey: 'catAdventureDesc'
    },
    {
      id: 'beach',
      nameKey: 'catBeach',
      icon: '🏖️',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      descKey: 'catBeachDesc'
    },
    {
      id: 'pilgrimage',
      nameKey: 'catPilgrimage',
      icon: '🛕',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop',
      descKey: 'catPilgrimageDesc'
    },
  ];

  return (
    <section className="categories-section">
      <div className="section-header">
        <span className="section-badge">🗂️ {t('browseByCategory')}</span>
        <h2 className="section-title">{t('chooseTravelStyle')}</h2>
        <p className="section-subtitle">{t('findPerfectPackage')}</p>
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="category-card"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onCategorySelect && onCategorySelect(category.id)}
          >
            <div className="category-image">
              <img src={category.image} alt={t(category.nameKey)} />
              <div className="category-overlay"></div>
            </div>
            <div className="category-content">
              <span className="category-icon">{category.icon}</span>
              <h3>{t(category.nameKey)}</h3>
              <p>{t(category.descKey)}</p>
              <span className="category-count">{categoryCounts[category.id] || 0} {t('packages')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
