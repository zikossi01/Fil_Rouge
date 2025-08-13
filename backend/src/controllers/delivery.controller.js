const Delivery = require('../models/Delivery.model');
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const { getIO } = require('../config/socket');
const logger = require('../utils/logger');

// @desc    Get delivery assignments
// @route   GET /api/deliveries
// @access  Private (Delivery personnel)
exports.getDeliveries = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'delivery') {
      query.deliveryPersonnel = req.user.id;
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const deliveries = await Delivery.find(query)
      .populate({
        path: 'order',
        populate: {
          path: 'user',
          select: 'firstName lastName phone'
        }
      })
      .populate('deliveryPersonnel', 'firstName lastName phone vehicle')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      deliveries
    });
  } catch (error) {
    logger.error('Get deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update delivery status
// @route   PUT /api/deliveries/:id/status
// @access  Private (Delivery personnel)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const delivery = await Delivery.findById(req.params.id).populate('order');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    if (delivery.deliveryPersonnel.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    delivery.status = status;

    // Update route tracking
    if (location) {
      delivery.route.push(location);
    }

    // Set times
    if (status === 'pickup_in_progress' && !delivery.startTime) {
      delivery.startTime = new Date();
    }
    
    if (status === 'delivered' && !delivery.endTime) {
      delivery.endTime = new Date();
      delivery.actualDuration = Math.floor((delivery.endTime - delivery.startTime) / 60000); // in minutes
    }

    await delivery.save();

    // Update order status
    let orderStatus = 'ready_for_pickup';
    switch (status) {
      case 'pickup_in_progress':
        orderStatus = 'preparing';
        break;
      case 'picked_up':
      case 'in_transit':
        orderStatus = 'out_for_delivery';
        break;
      case 'delivered':
        orderStatus = 'delivered';
        break;
      case 'failed':
        orderStatus = 'pending';
        break;
    }

    const order = delivery.order;
    order.status = orderStatus;
    order.trackingUpdates.push({
      status: orderStatus,
      message: `Delivery ${status}`,
      location
    });

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    // Send real-time update
    try {
      const io = getIO();
      io.to(order.user.toString()).emit('delivery_update', {
        orderId: order._id,
        deliveryStatus: status,
        location,
        message: `Your delivery is ${status}`
      });
    } catch (socketError) {
      logger.error('Socket notification failed:', socketError);
    }

    res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully',
      delivery
    });
  } catch (error) {
    logger.error('Update delivery status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update delivery location
// @route   PUT /api/deliveries/:id/location
// @access  Private (Delivery personnel)
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const delivery = await Delivery.findById(req.params.id).populate('order');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    if (delivery.deliveryPersonnel.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update delivery route
    delivery.route.push({ lat, lng });
    await delivery.save();

    // Update user's current location
    await User.findByIdAndUpdate(req.user.id, {
      currentLocation: { lat, lng }
    });

    // Send real-time location update
    try {
      const io = getIO();
      io.to(delivery.order.user.toString()).emit('delivery_location_update', {
        orderId: delivery.order._id,
        location: { lat, lng },
        timestamp: new Date()
      });
    } catch (socketError) {
      logger.error('Socket notification failed:', socketError);
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    logger.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};