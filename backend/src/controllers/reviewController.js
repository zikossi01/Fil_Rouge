// controllers/reviewController.js
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Create a review
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'products.product': productId,
      status: 'delivered'
    });
    
    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      comment,
      isVerifiedPurchase: !!hasPurchased
    });
    
    const savedReview = await review.save();
    await savedReview.populate('user', 'name');
    
    // Update product average rating
    await updateProductRating(productId);
    
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Review.countDocuments({ product: productId });
    
    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    
    const updatedReview = await review.save();
    await updatedReview.populate('user', 'name');
    
    // Update product average rating
    await updateProductRating(review.product);
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    
    // Update product average rating
    await updateProductRating(productId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);
  
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
};