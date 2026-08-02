import api from './api';

export const paymentService = {
  // Get Razorpay Key
  getRazorpayKey: async () => {
    try {
      const response = await api.get('/payments/key');
      if (!response.data.success) {
        throw new Error('Failed to fetch Razorpay key');
      }
      return response.data;
    } catch (error) {
      console.error('Error getting Razorpay key:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to fetch Razorpay key';
      throw new Error(msg);
    }
  },

  // Create a new order
  createOrder: async (vehicleId, quantity = 1, customerDetails = {}) => {
    try {
      const response = await api.post('/payments/create-order', { vehicleId, quantity, customerDetails });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create order');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      // Prefer server-provided message when available
      const msg = error.response?.data?.message || error.message || 'Failed to create order';
      throw new Error(msg);
    }
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify-payment', paymentData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to verify payment');
      }
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to verify payment';
      throw new Error(msg);
    }
  },

  // Seller sales analytics
  getSellerSales: async () => {
    try {
      const response = await api.get('/payments/seller-sales');
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch seller sales');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching seller sales:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to fetch seller sales';
      throw new Error(msg);
    }
  },

  // Buyer purchase history
  getMyPurchases: async () => {
    try {
      const response = await api.get('/payments/my-purchases');
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch purchases');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching purchases:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to fetch purchases';
      throw new Error(msg);
    }
  }
};
