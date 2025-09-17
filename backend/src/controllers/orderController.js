const Order = require('../models/Order');
const Product = require('../models/Product');


const createOrder = async (req, res) => {
  try {
    const { products, deliveryAddress, paymentMethod, notes } = req.body;

    if (products && products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

   
    let totalAmount = 0;
    const orderItems = [];

    for (let item of products) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

     
    }

    const deliveryFee = 10; 
    totalAmount += deliveryFee;

    const order = new Order({
      user: req.user._id,
      products: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      deliveryFee,
      notes,
      estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000) 
    });

    const createdOrder = await order.save();
    await createdOrder.populate('products.product', 'name price image');

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name price image');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      
      if (status === 'delivered') {
        order.deliveryTime = new Date();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .populate('products.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};