
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
 
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80&auto=format&fit=crop'
  },
 
  stock: {
    type: Number,
    required: false,
    min: 0,
    default: Number.MAX_SAFE_INTEGER
  },
  unit: {
    type: String,
    enum: ['kg', 'piece', 'liter', 'pack', 'serving', 'box', 'combo', 'set', 'pair', 'bottle', 'tube', 'jar', 'bag', 'volume', 'edition'],
    default: 'piece'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },

  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);