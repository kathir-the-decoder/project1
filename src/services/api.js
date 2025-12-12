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

// Bookings
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    // Demo mode - simulate booking
    const tour = localTours.find(t => t.id === bookingData.tourId || t._id === bookingData.tourId);
    return {
      data: {
        _id: 'demo-' + Date.now(),
        ...bookingData,
        tour,
        totalPrice: tour ? tour.price * bookingData.guests : 0,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    };
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    return { data: [] };
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
      role: 'user'
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

// Enquiries
export const createEnquiry = async (enquiryData) => {
  try {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  } catch (error) {
    // Demo mode
    return {
      success: true,
      data: {
        _id: 'demo-enquiry-' + Date.now(),
        ...enquiryData,
        status: 'new',
        createdAt: new Date().toISOString()
      }
    };
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

export default api;
