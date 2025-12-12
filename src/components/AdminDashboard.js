import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { getTours, getBookings } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function AdminDashboard({ user, onLogout }) {
  const { formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [toursRes, bookingsRes] = await Promise.all([
        getTours().catch(() => ({ data: [] })),
        getBookings().catch(() => ({ data: [] })),
      ]);
      setTours(toursRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTours([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalTours: tours?.length || 0,
    totalBookings: bookings?.length || 0,
    totalRevenue: bookings?.reduce((sum, b) => sum + (b.totalPrice || 0), 0) || 0,
    pendingBookings: bookings?.filter((b) => b.status === 'pending')?.length || 0,
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-brand">
          <h1>🎯 Admin Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>
        <button onClick={onLogout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-info">
            <h3>{stats.totalTours}</h3>
            <p>Total Tours</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatPrice(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingBookings}</h3>
            <p>Pending Bookings</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'tours' ? 'active' : ''}`}
          onClick={() => setActiveTab('tours')}
        >
          Tours Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings Management
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'tours' && (
          <div className="tours-table">
            <h2>All Tours</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Max Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours && tours.length > 0 ? (
                  tours.map((tour) => (
                    <tr key={tour._id || tour.id}>
                      <td>{tour.name}</td>
                      <td>{tour.location}</td>
                      <td>{formatPrice(tour.price)}</td>
                      <td>{tour.duration}</td>
                      <td>⭐ {tour.rating}</td>
                      <td>{tour.maxGroupSize}</td>
                      <td>
                        <button className="action-btn edit">Edit</button>
                        <button className="action-btn delete">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      No tours available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-table">
            <h2>All Bookings</h2>
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Tour</th>
                  <th>Date</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>#{booking._id?.slice(-6) || 'N/A'}</td>
                      <td>{booking.name}</td>
                      <td>{booking.tour?.name || 'N/A'}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{booking.guests}</td>
                      <td>{formatPrice(booking.totalPrice)}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn view">View</button>
                        <button className="action-btn approve">Approve</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
