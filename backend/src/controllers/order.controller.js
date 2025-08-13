const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const Delivery = require('../models/Delivery.model');
const paymentService = require('../services/payment.service');
const notificationService = require('../services/notification.service');
const { getIO } = require('../config/socket');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      items, 
      deliveryAddress, 
      paymentMethod, 
      deliveryFee = 5,
      tax = 0,
      discount = 0,
      notes 
    } = req.body;

    // Validate and calculate order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with id ${item.product} not found`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const total = subtotal + deliveryFee + tax - discount;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      deliveryAddress,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      paymentMethod,
      notes
    });

    // Process payment if needed
    if (paymentMethod === 'card') {
      try {
        const paymentResult = await paymentService.createPaymentIntent({
          amount: total * 100, // Convert to cents
          currency: 'usd',
          metadata: {
            orderId: order._id.toString(),
            userId: req.user.id
          }
        });

        order.paymentIntent = paymentResult.id;
        await order.save();

        res.status(201).json({
          success: true,
          message: 'Order created successfully',
          order,
          paymentClientSecret: paymentResult.client_secret
        });
      } catch (paymentError) {
        // Rollback stock changes
        for (const item of orderItems) {
          const product = await Product.findById(item.product);
          product.stock += item.quantity;
          await product.save();
        }

        await Order.findByIdAndDelete(order._id);

        logger.error('Payment processing failed:', paymentError);
        return res.status(400).json({
          success: false,
          message: 'Payment processing failed'
        });
      }
    } else {
      // For cash or other payment methods
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
      });
    }

    // Send notification to admin
    try {
      const io = getIO();
      io.to('admin').emit('new_order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        customerName: `${req.user.firstName} ${req.user.lastName}`
      });
    } catch (socketError) {
      logger.error('Socket notification failed:', socketError);
    }

  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // If not admin, only show user's orders
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price images')
      .populate('deliveryPersonnel', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price images')
      .populate('deliveryPersonnel', 'firstName lastName phone vehicle');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && 
        order.user._id.toString() !== req.user.id && 
        order.deliveryPersonnel?._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Delivery)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        req.user.role !== 'delivery' &&
        order.deliveryPersonnel?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const previousStatus = order.status;
    order.status = status;

    // Add tracking update
    order.trackingUpdates.push({
      status,
      message: `Order status updated to ${status}`,
      location
    });

    // Set delivery time if delivered
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    // Send real-time update
    try {
      const io = getIO();
      io.to(order.user.toString()).emit('order_update', {
        orderId: order._id,
        status,
        message: `Your order is now ${status}`
      });
    } catch (socketError) {
      logger.error('Socket notification failed:', socketError);
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can cancel this order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    order.trackingUpdates.push({
      status: 'cancelled',
      message: 'Order cancelled by customer'
    });

    await order.save();

    // Process refund if payment was made
    if (order.paymentStatus === 'paid' && order.paymentIntent) {
      try {
        await paymentService.refundPayment(order.paymentIntent);
        order.paymentStatus = 'refunded';
        await order.save();
      } catch (refundError) {
        logger.error('Refund failed:', refundError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    logger.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Assign delivery personnel
// @route   PUT /api/orders/:id/assign-delivery
// @access  Private (Admin)
exports.assignDeliveryPersonnel = async (req, res) => {
  try {
    const { deliveryPersonnelId } = req.body;
    
    const order = await Order.findById(req.params.id);
    const deliveryPerson = await User.findById(deliveryPersonnelId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!deliveryPerson || deliveryPerson.role !== 'delivery') {
      return res.status(404).json({
        success: false,
        message: 'Delivery personnel not found'
      });
    }

    if (!deliveryPerson.isOnline) {
      return res.status(400).json({
        success: false,
        message: 'Delivery personnel is not online'
      });
    }

    order.deliveryPersonnel = deliveryPersonnelId;
    order.status = 'ready_for_pickup';
    order.trackingUpdates.push({
      status: 'ready_for_pickup',
      message: 'Delivery personnel assigned'
    });

    await order.save();

    // Create delivery record
    await Delivery.create({
      order: order._id,
      deliveryPersonnel: deliveryPersonnelId,
      pickupLocation: {
        address: 'Store Address', // You should have store address in config
        coordinates: { lat: 0, lng: 0 } // Store coordinates
      },
      deliveryLocation: {
        address: `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`,
        coordinates: order.deliveryAddress.coordinates
      },
      deliveryFee: order.deliveryFee
    });

    // Send notification to delivery personnel
    try {
      const io = getIO();
      io.to(deliveryPersonnelId.toString()).emit('new_delivery', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        deliveryAddress: order.deliveryAddress
      });
    } catch (socketError) {
      logger.error('Socket notification failed:', socketError);
    }

    res.status(200).json({
      success: true,
      message: 'Delivery personnel assigned successfully',
      order
    });
  } catch (error) {
    logger.error('Assign delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};