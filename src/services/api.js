import axios from 'axios';
import { tours as localTours } from '../data/tours';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Tours - fallback to local data if backend unavailable
export const getTours = async (params = {}) => {
  try {
    const response = await api.get('/tours', { params });
    // If backend returns data, use it; otherwise use local
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data;
    }
    return { data: localTours };
  } catch (error) {
    console.log('Backend unavailable, using local tours data:', localTours.length, 'tours');
    return { data: localTours };
  }
};

export const getTour = async (id) => {
  try {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  } catch (error) {
    const tour = localTours.find(t => t.id === parseInt(id) || t._id === id);
    return { data: tour };
  }
};

// Helper function to get bookings from localStorage
const getLocalBookings = () => {
  try {
    const bookings = localStorage.getItem('tourBookings');
    return bookings ? JSON.parse(bookings) : [];
  } catch {
    return [];
  }
};

// Helper function to save bookings to localStorage
const saveLocalBookings = (bookings) => {
  localStorage.setItem('tourBookings', JSON.stringify(bookings));
};

// Bookings
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    // Demo mode - save to localStorage with pending status
    const booking = {
      _id: 'booking-' + Date.now(),
      ...bookingData,
      tourName: bookingData.tour?.name || bookingData.tourName,
      tourId: bookingData.tour?.id || bookingData.tour?._id || bookingData.tourId,
      status: 'pending', // All bookings start as pending
      createdAt: new Date().toISOString()
    };
    
    const bookings = getLocalBookings();
    bookings.push(booking);
    saveLocalBookings(bookings);
    
    return { data: booking };
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    // Demo mode - return localStorage bookings
    return { data: getLocalBookings() };
  }
};

export const getBooking = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    return { data: null };
  }
};

// Helper function to get registered users from localStorage
const getRegisteredUsers = () => {
  try {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// Helper function to save user to localStorage
const saveRegisteredUser = (user, password) => {
  const users = getRegisteredUsers();
  // Check if user already exists
  const existingIndex = users.findIndex(u => u.email === user.email);
  if (existingIndex >= 0) {
    users[existingIndex] = { ...user, password };
  } else {
    users.push({ ...user, password });
  }
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Users
export const register = async (userData) => {
  // Check if email already exists
  const existingUsers = getRegisteredUsers();
  if (existingUsers.find(u => u.email === userData.email)) {
    throw new Error('Email already registered');
  }

  // Try backend first
  try {
    const response = await api.post('/users/register', userData);
    // Save to localStorage as backup
    saveRegisteredUser(response.data.user, userData.password);
    return response.data;
  } catch (error) {
    // Demo mode - save to localStorage
    console.log('Backend unavailable, saving user locally');
    const newUser = {
      _id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Save user with password to localStorage
    saveRegisteredUser(newUser, userData.password);
    
    return {
      user: newUser,
      token: 'token-' + Date.now()
    };
  }
};

export const login = async (credentials) => {
  // First check demo credentials (works without backend)
  if (credentials.email === 'admin@tourexplorer.com' && credentials.password === 'admin123') {
    return {
      user: {
        _id: 'demo-admin',
        name: 'Admin User',
        email: 'admin@tourexplorer.com',
        role: 'admin'
      },
      token: 'demo-admin-token'
    };
  }
  if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
    return {
      user: {
        _id: 'demo-user',
        name: 'Demo User',
        email: 'user@example.com',
        role: 'user'
      },
      token: 'demo-user-token'
    };
  }
  
  // Check localStorage for registered users
  const registeredUsers = getRegisteredUsers();
  const localUser = registeredUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (localUser) {
    // Return user without password
    const { password, ...userWithoutPassword } = localUser;
    return {
      user: userWithoutPassword,
      token: 'local-token-' + Date.now()
    };
  }
  
  // Try backend if not found locally
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error('Invalid email or password');
  }
};

// Enquiries - sends email to admin
export const createEnquiry = async (enquiryData) => {
  // Web3Forms API key - Get free key at https://web3forms.com/
  const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY_HERE'; // Replace with your Web3Forms access key
  const ADMIN_EMAIL = 'admin@tourexplorer.com'; // Replace with your admin email

  const enquiryContent = `
NEW ENQUIRY FROM TOUR EXPLORER WEBSITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Customer Details:
   Name: ${enquiryData.name}
   Email: ${enquiryData.email}
   Phone: ${enquiryData.phone}

🌍 Preferred Destination: ${enquiryData.destination || 'Not specified'}

💬 Message:
${enquiryData.message || 'No message provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Received: ${new Date().toLocaleString()}
  `;

  // Try to send email to admin via Web3Forms
  try {
    if (WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          from_name: enquiryData.name,
          subject: `New Enquiry - ${enquiryData.destination || 'Tour Explorer'} - ${enquiryData.name}`,
          message: enquiryContent,
          reply_to: enquiryData.email,
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('✅ Enquiry email sent to admin');
      }
    }
  } catch (emailError) {
    console.log('Email sending failed:', emailError);
  }

  // Also try backend
  try {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  } catch (error) {
    // Demo mode - save locally
    const enquiry = {
      _id: 'enquiry-' + Date.now(),
      ...enquiryData,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage for admin to see
    const enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]');
    enquiries.push(enquiry);
    localStorage.setItem('enquiries', JSON.stringify(enquiries));
    
    console.log('📧 Enquiry saved:', enquiry);
    return { success: true, data: enquiry };
  }
};

// Get all enquiries (for admin)
export const getEnquiries = async () => {
  try {
    const response = await api.get('/enquiries');
    return response.data;
  } catch (error) {
    // Demo mode - return localStorage enquiries
    const enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]');
    return { data: enquiries };
  }
};

// Stats (for admin dashboard)
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/stats/dashboard');
    return response.data;
  } catch (error) {
    return {
      success: true,
      data: {
        totalTours: 100,
        totalBookings: 0,
        totalUsers: 2,
        totalRevenue: 0,
        pendingBookings: 0,
        newEnquiries: 0
      }
    };
  }
};

// Get all users (for admin)
export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    // Demo mode - return localStorage users + demo users
    const registeredUsers = getRegisteredUsers();
    const demoUsers = [
      { _id: 'demo-admin', name: 'Admin User', email: 'admin@tourexplorer.com', role: 'admin', createdAt: '2024-01-01' },
      { _id: 'demo-user', name: 'Demo User', email: 'user@example.com', role: 'user', createdAt: '2024-01-01' }
    ];
    
    // Combine demo users with registered users (without passwords)
    const allUsers = [...demoUsers, ...registeredUsers.map(({ password, ...user }) => ({
      ...user,
      createdAt: user.createdAt || new Date().toISOString()
    }))];
    
    return { data: allUsers };
  }
};

// Delete user (for admin)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    // Demo mode - remove from localStorage
    const users = getRegisteredUsers();
    const updatedUsers = users.filter(u => u._id !== userId);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    return { success: true };
  }
};

// Update booking status (for admin)
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}`, { status });
    return response.data;
  } catch (error) {
    // Demo mode - update in localStorage
    const bookings = getLocalBookings();
    const updatedBookings = bookings.map(b => 
      b._id === bookingId ? { ...b, status } : b
    );
    saveLocalBookings(updatedBookings);
    
    // Get the updated booking for email
    const booking = updatedBookings.find(b => b._id === bookingId);
    return { success: true, data: booking };
  }
};

// Send email notification using Web3Forms (FREE - no signup required for testing)
export const sendBookingEmail = async (booking, status) => {
  const statusMessage = status === 'confirmed' 
    ? '✅ APPROVED - Your booking has been confirmed! Get ready for your adventure!'
    : '❌ CANCELLED - Unfortunately, your booking has been cancelled. Please contact us for more information.';

  const emailContent = `
TOUR EXPLORER - BOOKING ${status.toUpperCase()}

Hello ${booking.name},

${statusMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 Booking ID: #${booking._id}
🌍 Tour: ${booking.tourName || booking.tour?.name || 'N/A'}
📅 Date: ${new Date(booking.date).toLocaleDateString()}
👥 Guests: ${booking.guests}
💰 Total: ₹${booking.totalPrice}
📊 Status: ${status.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing Tour Explorer!

Best regards,
Tour Explorer Team
✈️ www.tourexplorer.com
  `;

  // Use Web3Forms API (free, works immediately)
  // Get your free access key at: https://web3forms.com/
  const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY_HERE'; // Replace with your Web3Forms access key

  try {
    // If Web3Forms is configured, send real email
    if (WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          to: booking.email, // This sends to the customer
          from_name: 'Tour Explorer',
          subject: `Tour Explorer - Booking ${status.toUpperCase()} - ${booking.tourName || booking.tour?.name}`,
          message: emailContent,
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('✅ Email sent successfully to:', booking.email);
        return { success: true, message: `Email sent to ${booking.email}` };
      }
    }
  } catch (error) {
    console.log('Web3Forms error:', error);
  }

  // Fallback: Show notification (email content logged)
  console.log('📧 Email content for', booking.email, ':\n', emailContent);
  
  return { 
    success: true, 
    message: `Booking ${status}! (To send real emails, get free API key from web3forms.com)`,
    emailContent 
  };
};

export default api;
