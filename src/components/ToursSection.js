import React from 'react';
import TourCard from './TourCard';
import SearchBar from './SearchBar';
import { useLanguage } from '../context/LanguageContext';

function ToursSection({ filteredTours, allTours, onSearch, onFilter, onBook, onView }) {
  const { t } = useLanguage();

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
          filteredTours.map((tour) => (
            <TourCard key={tour._id || tour.id} tour={tour} onBook={onBook} onView={onView} id={`tour-${tour.id || tour._id}`} />
          ))
        ) : (
          <div className="no-results">
            <p>{t('noResults')}</p>
          </div>
        )}
      </main>
    </section>
  );
}

export default ToursSection;
