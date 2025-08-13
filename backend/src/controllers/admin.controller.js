const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const Order = require('../models/Order.model');
const Delivery = require('../models/Delivery.model');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = await Promise.all([
      // Total users
      User.countDocuments({ role: 'customer' }),
      // Total orders today
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      // Total revenue this month
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfMonth },
            status: { $in: ['delivered', 'out_for_delivery'] }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      // Active delivery personnel
      User.countDocuments({ role: 'delivery', isOnline: true }),
      // Pending orders
      Order.countDocuments({ status: 'pending' }),
      // Low stock products
      Product.countDocuments({ stock: { $lt: 10 }, isActive: true })
    ]);

    const [
      totalUsers,
      todayOrders,
      monthlyRevenue,
      activeDelivery,
      pendingOrders,
      lowStockProducts
    ] = stats;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName')
      .populate('deliveryPersonnel', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber total status createdAt');

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        todayOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        activeDelivery,
        pendingOrders,
        lowStockProducts
      },
      recentOrders
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Role filter
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Search filter
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      unit,
      minOrderQuantity,
      maxOrderQuantity,
      tags,
      nutritionInfo,
      isFeatured
    } = req.body;

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'grocery-delivery/products'
          });
          images.push({
            url: result.secure_url,
            public_id: result.public_id
          });
        } catch (uploadError) {
          logger.error('Image upload error:', uploadError);
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      category,
      images,
      stock,
      unit,
      minOrderQuantity,
      maxOrderQuantity,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      nutritionInfo,
      isFeatured: isFeatured === 'true'
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    logger.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      unit,
      minOrderQuantity,
      maxOrderQuantity,
      tags,
      nutritionInfo,
      isFeatured,
      isActive
    } = req.body;

    // Handle new image uploads
    let newImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'grocery-delivery/products'
          });
          newImages.push({
            url: result.secure_url,
            public_id: result.public_id
          });
        } catch (uploadError) {
          logger.error('Image upload error:', uploadError);
        }
      }
    }

    // Update product
    const updatedData = {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      originalPrice: originalPrice || product.originalPrice,
      category: category || product.category,
      stock: stock !== undefined ? stock : product.stock,
      unit: unit || product.unit,
      minOrderQuantity: minOrderQuantity || product.minOrderQuantity,
      maxOrderQuantity: maxOrderQuantity || product.maxOrderQuantity,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : product.tags,
      nutritionInfo: nutritionInfo || product.nutritionInfo,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured,
      isActive: isActive !== undefined ? isActive === 'true' : product.isActive
    };

    // Add new images if any
    if (newImages.length > 0) {
      updatedData.images = [...product.images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from cloudinary
    for (const image of product.images) {
      if (image.public_id) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
        } catch (deleteError) {
          logger.error('Image deletion error:', deleteError);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon, sortOrder } = req.body;

    let image = {};
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'grocery-delivery/categories'
        });
        image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (uploadError) {
        logger.error('Image upload error:', uploadError);
      }
    }

    const category = await Category.create({
      name,
      description,
      image,
      icon,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    logger.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, description, icon, sortOrder, isActive } = req.body;

    const updateData = {
      name: name || category.name,
      description: description || category.description,
      icon: icon || category.icon,
      sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
      isActive: isActive !== undefined ? isActive === 'true' : category.isActive
    };

    // Handle new image upload
    if (req.file) {
      try {
        // Delete old image
        if (category.image.public_id) {
          await cloudinary.uploader.destroy(category.image.public_id);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'grocery-delivery/categories'
        });
        updateData.image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (uploadError) {
        logger.error('Image upload error:', uploadError);
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    logger.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    // Delete image from cloudinary
    if (category.image.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (deleteError) {
        logger.error('Image deletion error:', deleteError);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    logger.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('deliveryPersonnel', 'firstName lastName phone')
      .populate('items.product', 'name price')
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
    logger.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};