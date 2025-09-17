const Delivery = require('../models/Delivery');
const Order = require('../models/Order');


const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const delivery = new Delivery({
      order: orderId,
      deliveryPerson: deliveryPersonId
    });

    const createdDelivery = await delivery.save();
    
  
    order.status = 'on_delivery';
    await order.save();

    res.status(201).json(createdDelivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getDeliveryPersonOrders = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliveryPerson: req.user._id })
      .populate({
        path: 'order',
        populate: {
          path: 'user',
          select: 'name phone'
        }
      })
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const delivery = await Delivery.findById(req.params.id);

    if (delivery) {
      delivery.status = status;
      delivery.notes = notes || delivery.notes;

      if (status === 'picked_up') {
        delivery.pickupTime = new Date();
      } else if (status === 'delivered') {
        delivery.deliveryTime = new Date();
        
       
        const order = await Order.findById(delivery.order);
        if (order) {
          order.status = 'delivered';
          await order.save();
        }
      }

      const updatedDelivery = await delivery.save();
      res.json(updatedDelivery);
    } else {
      res.status(404).json({ message: 'Delivery not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({})
      .populate('deliveryPerson', 'name phone')
      .populate({
        path: 'order',
        populate: {
          path: 'user',
          select: 'name phone'
        }
      })
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  assignDelivery,
  getDeliveryPersonOrders,
  updateDeliveryStatus,
  getAllDeliveries
};


const listAvailableOrders = async (req, res) => {
  try {
    const deliveries = await Delivery.find({}).select('order');
    const assignedOrderIds = new Set(deliveries.map(d => String(d.order)));
    const available = await Order.find({ status: { $in: ['confirmed','preparing','pending'] } })
      .sort({ createdAt: -1 })
      .populate('user', 'name phone')
      .populate('products.product', 'name price image');
    const unassigned = available.filter(o => !assignedOrderIds.has(String(o._id)));
    res.json(unassigned);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const claimOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const existing = await Delivery.findOne({ order: orderId });
    if (existing) return res.status(400).json({ message: 'Order already assigned' });

    const delivery = new Delivery({ order: orderId, deliveryPerson: req.user._id });
    await delivery.save();
    order.status = 'on_delivery';
    await order.save();

    const populated = await Delivery.findById(delivery._id)
      .populate('deliveryPerson', 'name phone')
      .populate({ path: 'order', populate: [{ path: 'user', select: 'name phone' }, { path: 'products.product', select: 'name price image' }] });

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.listAvailableOrders = listAvailableOrders;
module.exports.claimOrder = claimOrder;