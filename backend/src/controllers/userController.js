// controllers/userController.js
const User = require('../models/User');
const Order = require('../models/Order');

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, role, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.role = role || user.role;
      user.isActive = isActive !== undefined ? isActive : user.isActive;
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalDeliveryPersons = await User.countDocuments({ role: 'delivery' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    res.json({
      totalUsers,
      totalClients,
      totalDeliveryPersons,
      newUsersThisMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get delivery persons (Admin only)
const getDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await User.find({ role: 'delivery', isActive: true })
      .select('name email phone address');
    
    res.json(deliveryPersons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  getUserStats,
  getDeliveryPersons
};