import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { getTours, getBookings, getUsers, deleteUser, updateBookingStatus, sendBookingEmail, getEnquiries } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function AdminDashboard({ user, onLogout }) {
  const { formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [toursRes, bookingsRes, usersRes, enquiriesRes] = await Promise.all([
        getTours().catch(() => ({ data: [] })),
        getBookings().catch(() => ({ data: [] })),
        getUsers().catch(() => ({ data: [] })),
        getEnquiries().catch(() => ({ data: [] })),
      ]);
      setTours(toursRes.data || []);
      setBookings(bookingsRes.data || []);
      setUsers(usersRes.data || []);
      setEnquiries(enquiriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    const booking = bookings.find(b => b._id === bookingId);
    const action = status === 'confirmed' ? 'approve' : 'cancel';
    
    if (!window.confirm(`Are you sure you want to ${action} this booking? An email will be sent to ${booking?.email}`)) {
      return;
    }
    
    try {
      // Update booking status
      const result = await updateBookingStatus(bookingId, status);
      
      // Send email notification
      const updatedBooking = result.data || { ...booking, status };
      await sendBookingEmail(updatedBooking, status);
      
      // Update local state
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status } : b
      ));
      
      const message = status === 'confirmed' 
        ? `✅ Booking approved! Confirmation email sent to ${booking?.email}`
        : `❌ Booking cancelled! Cancellation email sent to ${booking?.email}`;
      
      alert(message);
    } catch (error) {
      alert('Error updating booking');
    }
  };

  const stats = {
    totalTours: tours?.length || 0,
    totalBookings: bookings?.length || 0,
    totalRevenue: bookings?.reduce((sum, b) => sum + (b.totalPrice || 0), 0) || 0,
    pendingBookings: bookings?.filter((b) => b.status === 'pending')?.length || 0,
    totalUsers: users?.length || 0,
    totalEnquiries: enquiries?.length || 0,
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
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📩</div>
          <div className="stat-info">
            <h3>{stats.totalEnquiries}</h3>
            <p>Enquiries</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'tours' ? 'active' : ''}`} onClick={() => setActiveTab('tours')}>
          Tours
        </button>
        <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
          Bookings
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users
        </button>
        <button className={`tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}>
          Enquiries
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'tours' && (
          <div className="tours-table">
            <h2>All Tours ({tours.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.length > 0 ? tours.map((tour) => (
                  <tr key={tour._id || tour.id}>
                    <td>{tour.name}</td>
                    <td>{tour.location}</td>
                    <td>{formatPrice(tour.price)}</td>
                    <td>{tour.duration}</td>
                    <td>⭐ {tour.rating}</td>
                    <td>
                      <button className="action-btn view" onClick={() => handleViewDetails(tour, 'tour')}>View</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No tours available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-table">
            <h2>All Bookings ({bookings.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Tour</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>#{booking._id?.slice(-6)}</td>
                    <td>{booking.name}</td>
                    <td>{booking.tour?.name || booking.tourName || 'N/A'}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{formatPrice(booking.totalPrice)}</td>
                    <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                    <td>
                      <button className="action-btn view" onClick={() => handleViewDetails(booking, 'booking')}>View</button>
                      {booking.status === 'pending' && (
                        <>
                          <button className="action-btn approve" onClick={() => handleBookingStatus(booking._id, 'confirmed')}>Approve</button>
                          <button className="action-btn delete" onClick={() => handleBookingStatus(booking._id, 'cancelled')}>Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No bookings yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-table">
            <h2>All Users ({users.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((u) => (
                  <tr key={u._id}>
                    <td>#{u._id?.slice(-6)}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button className="action-btn view" onClick={() => handleViewDetails(u, 'user')}>View</button>
                      {u.role !== 'admin' && !u._id?.startsWith('demo') && (
                        <button className="action-btn delete" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No users registered</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="enquiries-table">
            <h2>All Enquiries ({enquiries.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Destination</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length > 0 ? enquiries.map((enq) => (
                  <tr key={enq._id}>
                    <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                    <td>{enq.name}</td>
                    <td>{enq.email}</td>
                    <td>{enq.phone}</td>
                    <td>{enq.destination || 'N/A'}</td>
                    <td>
                      <button className="action-btn view" onClick={() => handleViewDetails(enq, 'enquiry')}>View</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No enquiries yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {modalType === 'tour' && (
              <div className="modal-content">
                <h2>🎫 Tour Details</h2>
                <img src={selectedItem.image} alt={selectedItem.name} className="modal-image" />
                <div className="detail-row"><strong>Name:</strong> {selectedItem.name}</div>
                <div className="detail-row"><strong>Location:</strong> {selectedItem.location}</div>
                <div className="detail-row"><strong>Price:</strong> {formatPrice(selectedItem.price)}</div>
                <div className="detail-row"><strong>Duration:</strong> {selectedItem.duration}</div>
                <div className="detail-row"><strong>Rating:</strong> ⭐ {selectedItem.rating}</div>
                <div className="detail-row"><strong>Max Group:</strong> {selectedItem.maxGroupSize} people</div>
                <div className="detail-row"><strong>Description:</strong> {selectedItem.description}</div>
              </div>
            )}

            {modalType === 'booking' && (
              <div className="modal-content">
                <h2>📋 Booking Details</h2>
                <div className="detail-row"><strong>Booking ID:</strong> #{selectedItem._id}</div>
                <div className="detail-row"><strong>Customer:</strong> {selectedItem.name}</div>
                <div className="detail-row"><strong>Email:</strong> {selectedItem.email}</div>
                <div className="detail-row"><strong>Phone:</strong> {selectedItem.phone || 'N/A'}</div>
                <div className="detail-row"><strong>Tour:</strong> {selectedItem.tour?.name || selectedItem.tourName}</div>
                <div className="detail-row"><strong>Date:</strong> {new Date(selectedItem.date).toLocaleDateString()}</div>
                <div className="detail-row"><strong>Guests:</strong> {selectedItem.guests}</div>
                <div className="detail-row"><strong>Total:</strong> {formatPrice(selectedItem.totalPrice)}</div>
                <div className="detail-row"><strong>Status:</strong> <span className={`status-badge ${selectedItem.status}`}>{selectedItem.status}</span></div>
                <div className="detail-row"><strong>Booked On:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</div>
              </div>
            )}

            {modalType === 'user' && (
              <div className="modal-content">
                <h2>👤 User Details</h2>
                <div className="detail-row"><strong>User ID:</strong> #{selectedItem._id}</div>
                <div className="detail-row"><strong>Name:</strong> {selectedItem.name}</div>
                <div className="detail-row"><strong>Email:</strong> {selectedItem.email}</div>
                <div className="detail-row"><strong>Role:</strong> <span className={`role-badge ${selectedItem.role}`}>{selectedItem.role}</span></div>
                <div className="detail-row"><strong>Registered:</strong> {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : 'N/A'}</div>
              </div>
            )}

            {modalType === 'enquiry' && (
              <div className="modal-content">
                <h2>📩 Enquiry Details</h2>
                <div className="detail-row"><strong>Enquiry ID:</strong> #{selectedItem._id}</div>
                <div className="detail-row"><strong>Name:</strong> {selectedItem.name}</div>
                <div className="detail-row"><strong>Email:</strong> <a href={`mailto:${selectedItem.email}`}>{selectedItem.email}</a></div>
                <div className="detail-row"><strong>Phone:</strong> <a href={`tel:${selectedItem.phone}`}>{selectedItem.phone}</a></div>
                <div className="detail-row"><strong>Destination:</strong> {selectedItem.destination || 'Not specified'}</div>
                <div className="detail-row"><strong>Message:</strong></div>
                <div className="enquiry-message">{selectedItem.message || 'No message provided'}</div>
                <div className="detail-row"><strong>Received:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
