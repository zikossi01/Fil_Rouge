const { getIO } = require('../config/socket');
const emailService = require('./email.service');
const logger = require('../utils/logger');

class NotificationService {
  async sendOrderNotification(userId, orderData, type = 'order_update') {
    try {
      const io = getIO();
      io.to(userId.toString()).emit(type, orderData);
    } catch (error) {
      logger.error('Socket notification failed:', error);
    }
  }

  async sendDeliveryNotification(userId, deliveryData, type = 'delivery_update') {
    try {
      const io = getIO();
      io.to(userId.toString()).emit(type, deliveryData);
    } catch (error) {
      logger.error('Socket notification failed:', error);
    }
  }

  async sendAdminNotification(data, type = 'admin_notification') {
    try {
      const io = getIO();
      io.to('admin').emit(type, data);
    } catch (error) {
      logger.error('Admin notification failed:', error);
    }
  }

  async sendDeliveryPersonnelNotification(deliveryPersonnelId, data, type = 'delivery_assignment') {
    try {
      const io = getIO();
      io.to(deliveryPersonnelId.toString()).emit(type, data);
    } catch (error) {
      logger.error('Delivery personnel notification failed:', error);
    }
  }

  async sendEmailAndSocketNotification(userId, email, orderData, emailType, socketType) {
    try {
      // Send socket notification
      await this.sendOrderNotification(userId, orderData, socketType);
      
      // Send email notification
      switch (emailType) {
        case 'order_confirmation':
          await emailService.sendOrderConfirmationEmail(email, orderData);
          break;
        case 'status_update':
          await emailService.sendOrderStatusUpdateEmail(email, orderData, orderData.status);
          break;
        default:
          break;
      }
    } catch (error) {
      logger.error('Combined notification failed:', error);
    }
  }
}

module.exports = new NotificationService();