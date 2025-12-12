const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalTours = await Tour.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalEnquiries = await Enquiry.countDocuments();

    // Revenue calculation
    const bookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

    // Pending bookings
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // New enquiries
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('tour', 'name location price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Popular tours (by booking count)
    const popularTours = await Booking.aggregate([
      { $group: { _id: '$tour', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'tours',
          localField: '_id',
          foreignField: '_id',
          as: 'tourDetails'
        }
      },
      { $unwind: '$tourDetails' }
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalTours,
        totalBookings,
        totalUsers,
        totalEnquiries,
        totalRevenue,
        pendingBookings,
        newEnquiries,
        recentBookings,
        popularTours,
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get booking stats by status
router.get('/bookings', async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get tour stats
router.get('/tours', async (req, res) => {
  try {
    const totalTours = await Tour.countDocuments();
    const avgPrice = await Tour.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    const avgRating = await Tour.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    // Tours by location
    const toursByLocation = await Tour.aggregate([
      {
        $group: {
          _id: { $arrayElemAt: [{ $split: ['$location', ', '] }, 1] },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalTours,
        avgPrice: avgPrice[0]?.avgPrice || 0,
        avgRating: avgRating[0]?.avgRating || 0,
        toursByLocation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
