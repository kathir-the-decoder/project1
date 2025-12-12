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

// Users
export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    // Demo mode
    return {
      user: {
        _id: 'demo-user-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user'
      },
      token: 'demo-token-' + Date.now()
    };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    // Demo mode - check demo credentials
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
    throw new Error('Invalid credentials');
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
