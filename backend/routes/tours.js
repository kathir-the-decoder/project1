const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { search, sort, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let tours = Tour.find(query);

    if (sort) {
      const sortBy = sort === 'price-low' ? 'price' : sort === 'price-high' ? '-price' : '-rating';
      tours = tours.sort(sortBy);
    }

    const result = await tours;
    res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create tour (admin only)
router.post('/', async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update tour
router.put('/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete tour
router.delete('/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.json({ success: true, message: 'Tour deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
