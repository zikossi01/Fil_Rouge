const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `"Grocery Delivery" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p>Thank you for registering with Grocery Delivery! Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email - Grocery Delivery',
      html
    });
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p>You have requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This reset link will expire in 10 minutes. If you didn't request this reset, please ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset - Grocery Delivery',
      html
    });
  }

  async sendOrderConfirmationEmail(email, order) {
    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.total.toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
        <p>Thank you for your order! Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Order #${order.orderNumber}</h3>
          <p style="margin: 5px 0; color: #666;">Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p style="margin: 5px 0; color: #666;">Status: ${order.status}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div style="text-align: right; margin: 20px 0;">
          <p style="margin: 5px 0;">Subtotal: ${order.subtotal.toFixed(2)}</p>
          <p style="margin: 5px 0;">Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
          <p style="margin: 5px 0;">Tax: ${order.tax.toFixed(2)}</p>
          ${order.discount > 0 ? `<p style="margin: 5px 0;">Discount: -${order.discount.toFixed(2)}</p>` : ''}
          <h3 style="margin: 10px 0 0 0; color: #333;">Total: ${order.total.toFixed(2)}</h3>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #333;">Delivery Address:</h4>
          <p style="margin: 0; color: #666;">
            ${order.deliveryAddress.street}<br>
            ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}
          </p>
        </div>

        <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
          We'll send you updates about your order status. Thank you for choosing Grocery Delivery!
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Order Confirmation #${order.orderNumber} - Grocery Delivery`,
      html
    });
  }

  async sendOrderStatusUpdateEmail(email, order, newStatus) {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      preparing: 'Your order is being prepared.',
      ready_for_pickup: 'Your order is ready for pickup by our delivery team.',
      out_for_delivery: 'Your order is out for delivery!',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.'
    };

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Order Status Update</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center;">
          <h3 style="color: #333; margin: 0 0 10px 0;">Order #${order.orderNumber}</h3>
          <p style="font-size: 18px; color: #4CAF50; font-weight: bold; margin: 10px 0;">
            Status: ${newStatus.toUpperCase()}
          </p>
          <p style="color: #666; margin: 0;">
            ${statusMessages[newStatus] || 'Your order status has been updated.'}
          </p>
        </div>
        <p style="text-align: center; margin-top: 20px;">
          <a href="${process.env.CLIENT_URL}/orders/${order._id}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Track Your Order
          </a>
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Order Update #${order.orderNumber} - ${newStatus}`,
      html
    });
  }
}

module.exports = new EmailService();