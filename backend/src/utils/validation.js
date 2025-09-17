
const validator = require('validator');
const mongoose = require('mongoose');


const validateEmail = (email) => {
  return validator.isEmail(email);
};


const validatePassword = (password) => {
  return password.length >= 6;
};

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};


const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


const validateProduct = (productData) => {
  const errors = [];
  
  if (!productData.name || productData.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long');
  }
  
  if (!productData.description || productData.description.trim().length < 10) {
    errors.push('Product description must be at least 10 characters long');
  }
  
  if (!productData.price || productData.price <= 0) {
    errors.push('Product price must be greater than 0');
  }
  
  if (!productData.category) {
    errors.push('Product category is required');
  }
  
  if (productData.stock !== undefined && productData.stock < 0) {
    errors.push('Product stock cannot be negative');
  }
  
  return errors;
};


const validateUserRegistration = (userData) => {
  const errors = [];
  
  if (!userData.name || userData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!validateEmail(userData.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!validatePassword(userData.password)) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!validatePhone(userData.phone)) {
    errors.push('Please provide a valid phone number');
  }
  
  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateObjectId,
  validateProduct,
  validateUserRegistration
};