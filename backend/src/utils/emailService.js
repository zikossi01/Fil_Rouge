// utils/emailService.js
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send order confirmation email
const sendOrderConfirmation = async (user, order) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Order Confirmation - Grocery Delivery',
      html: `
        <h2>Thank you for your order!</h2>
        <p>Hello ${user.name},</p>
        <p>Your order #${order._id} has been confirmed and is being processed.</p>
        <p><strong>Order Total:</strong> $${order.totalAmount}</p>
        <p><strong>Estimated Delivery:</strong> ${order.estimatedDeliveryTime.toLocaleString()}</p>
        <p>Thank you for shopping with us!</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Send delivery status update
const sendDeliveryUpdate = async (user, order, status) => {
  try {
    const transporter = createTransporter();
    const statusMessages = {
      'on_delivery': 'is on the way to your location',
      'delivered': 'has been delivered successfully'
    };
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Update - ${status}`,
      html: `
        <h2>Order Update</h2>
        <p>Hello ${user.name},</p>
        <p>Your order #${order._id} ${statusMessages[status] || 'status has been updated'}.</p>
        <p>Thank you for shopping with us!</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Send password reset email
const sendPasswordReset = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendDeliveryUpdate,
  sendPasswordReset
};