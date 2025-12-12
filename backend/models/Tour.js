const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Max group size is required'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    availableDates: [Date],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);
