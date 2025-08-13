const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  deliveryPersonnel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliveryLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: [
      'assigned',
      'pickup_in_progress',
      'picked_up',
      'in_transit',
      'arrived',
      'delivered',
      'failed'
    ],
    default: 'assigned'
  },
  distance: Number, // in kilometers
  estimatedDuration: Number, // in minutes
  actualDuration: Number,
  route: [{
    lat: Number,
    lng: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  deliveryFee: {
    type: Number,
    required: true
  },
  startTime: Date,
  endTime: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);