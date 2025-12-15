import React, { useState } from 'react';
import TourCard from './TourCard';
import SearchBar from './SearchBar';
import { useLanguage } from '../context/LanguageContext';

function ToursSection({ filteredTours, allTours, onSearch, onFilter, onBook, onView }) {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(12);

  const handleSeeMore = () => {
    // Increase by 12 each click until all are visible
    if (visibleCount >= filteredTours.length) {
      setVisibleCount(12);
    } else {
      setVisibleCount((prev) => Math.min(prev + 12, filteredTours.length));
    }
  };

  const scrollToTour = (tour) => {
    const element = document.getElementById(`tour-${tour.id || tour._id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-tour');
      setTimeout(() => element.classList.remove('highlight-tour'), 2000);
    }
  };

  return (
    <section className="tours-section">
      <div className="section-header">
        <span className="section-badge">{t('popularTours')}</span>
        <h2 className="section-title">{t('exploreBest')}</h2>
        <p className="section-subtitle">{t('handPicked')}</p>
        <p className="tours-count">
          Showing {filteredTours.length} of {allTours?.length || filteredTours.length} tour packages
        </p>
      </div>

      <SearchBar 
        onSearch={onSearch} 
        onFilter={onFilter} 
        tours={allTours || filteredTours}
        onSelectTour={scrollToTour}
      />

      <main className="tours-container">
        {filteredTours.length > 0 ? (
          // show only a subset controlled by visibleCount
          filteredTours.slice(0, visibleCount).map((tour) => (
            <TourCard key={tour._id || tour.id} tour={tour} onBook={onBook} onView={onView} id={`tour-${tour.id || tour._id}`} />
          ))
        ) : (
          <div className="no-results">
            <p>{t('noResults')}</p>
          </div>
        )}
      </main>

      {/* See more / See less */}
      {filteredTours.length > 12 && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={handleSeeMore}>
            {visibleCount >= filteredTours.length ? t('seeLess') : t('seeMore')}
          </button>
        </div>
      )}
    </section>
  );
}

export default ToursSection;
