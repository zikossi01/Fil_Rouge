const stripe = require('../config/stripe');
const logger = require('../utils/logger');

class PaymentService {
  async createPaymentIntent(options) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: options.amount,
        currency: options.currency || 'usd',
        metadata: options.metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Create payment intent error:', error);
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      logger.error('Confirm payment intent error:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount // If null, refunds the entire amount
      });

      return refund;
    } catch (error) {
      logger.error('Refund payment error:', error);
      throw error;
    }
  }

  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      logger.error('Get payment intent error:', error);
      throw error;
    }
  }

  async handleWebhook(signature, payload) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return event;
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw error;
    }
  }

  async createCustomer(customerData) {
    try {
      const customer = await stripe.customers.create({
        email: customerData.email,
        name: `${customerData.firstName} ${customerData.lastName}`,
        phone: customerData.phone,
        metadata: {
          userId: customerData.userId
        }
      });

      return customer;
    } catch (error) {
      logger.error('Create customer error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();