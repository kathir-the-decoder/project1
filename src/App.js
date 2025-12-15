import { useState, useEffect } from 'react';
import './App.css';
import BookingModal from './components/BookingModal';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Features from './components/Features';
import ToursSection from './components/ToursSection';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';
import TourDetailsModal from './components/TourDetailsModal';
import Settings from './components/Settings';
import Profile from './components/Profile';
import MyBookings from './components/MyBookings';
import Payments from './components/Payments';
import AIAssistant from './components/AIAssistant';
import BackgroundEffects from './components/BackgroundEffects';
import { getTours, createBooking, login, register } from './services/api';
import { useLanguage } from './context/LanguageContext';

function App() {
  const { t } = useLanguage();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [detailTour, setDetailTour] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    
    // Apply saved settings on load
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      // Apply theme (handle auto mode)
      let effectiveTheme = settings.theme || 'dark';
      if (effectiveTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        effectiveTheme = prefersDark ? 'dark' : 'light';
      }
      
      if (effectiveTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      }
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      
      // Apply font size
      const fontSizes = { small: '14px', medium: '16px', large: '18px' };
      document.documentElement.style.fontSize = fontSizes[settings.fontSize] || '16px';
      document.documentElement.setAttribute('data-font-size', settings.fontSize || 'medium');
    }
    
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await getTours();
      setTours(response.data);
      setFilteredTours(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      setShowAuthModal(false);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await register(userData);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      setShowAuthModal(false);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredTours(tours);
      return;
    }
    
    const searchTerm = term.toLowerCase();
    
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

    const filtered = tours.filter((tour) => {
      const nameMatch = tour.name.toLowerCase().includes(searchTerm);
      const locationMatch = tour.location.toLowerCase().includes(searchTerm);
      const descriptionMatch = tour.description.toLowerCase().includes(searchTerm);
      
      // Check region keywords
      let regionMatch = false;
      for (const [region, countries] of Object.entries(regionKeywords)) {
        if (searchTerm.includes(region)) {
          regionMatch = countries.some(country => 
            tour.location.toLowerCase().includes(country.toLowerCase())
          );
          if (regionMatch) break;
        }
      }

      return nameMatch || locationMatch || descriptionMatch || regionMatch;
    });
    
    setFilteredTours(filtered);
  };

  const handleCategorySelect = (categoryId) => {
    // Filter tours based on category - matching Categories.js counts
    let filtered = tours;
    switch (categoryId) {
      case 'international':
        filtered = tours.filter(t => !t.location?.includes('India'));
        break;
      case 'domestic':
        filtered = tours.filter(t => t.location?.includes('India'));
        break;
      case 'honeymoon':
        filtered = tours.filter(t => 
          t.location?.includes('Maldives') || 
          t.location?.includes('Bali') || 
          t.location?.includes('Paris') ||
          t.location?.includes('Santorini') ||
          t.location?.includes('Venice') ||
          t.location?.includes('Tahiti') ||
          t.location?.includes('Seychelles') ||
          t.location?.includes('Mauritius')
        );
        break;
      case 'adventure':
        filtered = tours.filter(t => 
          t.name?.includes('Trek') || 
          t.name?.includes('Adventure') || 
          t.name?.includes('Safari') ||
          t.name?.includes('Thrill') ||
          t.location?.includes('Nepal') ||
          t.location?.includes('New Zealand') ||
          t.location?.includes('Alaska') ||
          t.name?.includes('Wilderness')
        );
        break;
      case 'beach':
        filtered = tours.filter(t => 
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
        );
        break;
      case 'pilgrimage':
        filtered = tours.filter(t => 
          t.location?.includes('Varanasi') || 
          t.name?.includes('Spiritual') ||
          t.name?.includes('Holy') ||
          t.name?.includes('Pilgrimage') ||
          t.location?.includes('Jerusalem') ||
          t.name?.includes('Temple')
        );
        break;
      default:
        filtered = tours;
    }
    setFilteredTours(filtered);
    document.querySelector('.tours-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilter = (filterType) => {
    let sorted = [...filteredTours];
    switch (filterType) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        sorted.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      default:
        sorted = tours;
    }
    setFilteredTours(sorted);
  };

  const handleBooking = (tour) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedTour(tour);
  };

  const handleViewDetails = (tour) => {
    setDetailTour(tour);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      const payload = {
        tourId: bookingData.tour._id || bookingData.tour.id,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        date: bookingData.date,
        guests: bookingData.guests,
      };

      const response = await createBooking(payload);

      // Save booking to localStorage for My Bookings
      const newBooking = {
        tourName: bookingData.tour.name,
        tourLocation: bookingData.tour.location,
        tourImage: bookingData.tour.image,
        date: bookingData.date,
        guests: bookingData.guests,
        totalPrice: response.data.totalPrice || bookingData.tour.price * bookingData.guests,
        bookingId: response.data._id,
        bookedAt: new Date().toISOString()
      };
      
      const existingBookings = JSON.parse(localStorage.getItem(`bookings_${user.email}`) || '[]');
      existingBookings.unshift(newBooking);
      localStorage.setItem(`bookings_${user.email}`, JSON.stringify(existingBookings));

      alert(
        `📋 Booking Submitted!\n\nTour: ${bookingData.tour.name}\nName: ${bookingData.name}\nDate: ${bookingData.date}\nGuests: ${bookingData.guests}\nTotal: ${response.data.totalPrice}\n\nBooking ID: ${response.data._id}\n\n⏳ Status: PENDING\n\nYour booking is awaiting admin approval. You will receive an email confirmation once approved.`
      );
      setSelectedTour(null);
    } catch (err) {
      console.error('Booking error:', err);
      alert('❌ Failed to create booking. Please try again.');
    }
  };

  // Show auth modal only when explicitly requested
  if (showAuthModal && !user) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthView('register')}
        />
      );
    } else {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  // Show admin dashboard if user is admin
  if (user && user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>{t('loadingTours')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div className="error-content">
          <p>{t('failedToLoad')}</p>
          <button onClick={fetchTours} className="retry-btn">
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <BackgroundEffects />
      
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onLoginClick={() => setShowAuthModal(true)} 
        onSettingsClick={() => setShowSettings(true)}
        onProfileClick={() => setShowProfile(true)}
        onMyBookingsClick={() => setShowMyBookings(true)}
        onPaymentsClick={() => setShowPayments(true)}
      />

      <Hero onSearch={handleSearch} />

      <Categories onCategorySelect={handleCategorySelect} tours={tours} />

      <ToursSection
        filteredTours={filteredTours}
        allTours={tours}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onBook={handleBooking}
        onView={handleViewDetails}
      />

      <Features />

      <ContactSection />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>✈️ {t('brandName')}</h3>
            <p>{t('brandTagline')}</p>
          </div>
          <div className="footer-links">
            <h4>{t('quickLinks')}</h4>
            <a href="#home">{t('home')}</a>
            <a href="#tours">{t('toursNav')}</a>
            <a href="#about">{t('aboutNav')}</a>
            <a href="#contact">{t('contactNav')}</a>
          </div>
          <div className="footer-links">
            <h4>{t('popularDestinationsTitle')}</h4>
            <a href="#dubai">Dubai</a>
            <a href="#bali">Bali</a>
            <a href="#maldives">Maldives</a>
            <a href="#europe">Europe</a>
          </div>
          <div className="footer-links">
            <h4>{t('contactInfoTitle')}</h4>
            <p>{t('phoneContact')}</p>
            <p>✉️ info@tourexplorer.com</p>
            <p>📍 Mumbai, India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 {t('brandName')}. All rights reserved.</p>
        </div>
      </footer>

      {selectedTour && (
        <BookingModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {detailTour && (
        <TourDetailsModal tour={detailTour} onClose={() => setDetailTour(null)} />
      )}

      {showSettings && (
        <Settings user={user} onClose={() => setShowSettings(false)} />
      )}

      {showProfile && (
        <Profile 
          user={user} 
          onClose={() => setShowProfile(false)} 
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {showMyBookings && (
        <MyBookings user={user} onClose={() => setShowMyBookings(false)} />
      )}

      {showPayments && (
        <Payments user={user} onClose={() => setShowPayments(false)} />
      )}

      {/* AI Travel Assistant */}
      <AIAssistant 
        tours={tours} 
        onSelectTour={(tour) => setDetailTour(tour)} 
      />
    </div>
  );
}

export default App;
