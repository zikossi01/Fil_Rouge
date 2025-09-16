const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['assigned', 'picked_up', 'on_way', 'delivered'],
    default: 'assigned'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);