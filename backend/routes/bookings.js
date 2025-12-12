const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('tour', 'name location price');
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('tour');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { tourId, name, email, phone, date, guests } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    if (guests > tour.maxGroupSize) {
      return res.status(400).json({
        success: false,
        message: `Maximum group size is ${tour.maxGroupSize}`,
      });
    }

    const totalPrice = tour.price * guests;

    const booking = await Booking.create({
      tour: tourId,
      name,
      email,
      phone,
      date,
      guests,
      totalPrice,
    });

    const populatedBooking = await Booking.findById(booking._id).populate('tour');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('tour');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
