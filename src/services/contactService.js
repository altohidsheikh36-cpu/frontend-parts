import api from './api';

export const contactService = {
  submitContact: async (formData) => {
    try {
      const response = await api.post('/contact/submit', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to submit contact form';
      throw new Error(msg);
    }
  },

  // Admin only - Get all contacts
  getAllContacts: async () => {
    try {
      const response = await api.get('/contact/admin/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to fetch contacts';
      throw new Error(msg);
    }
  },

  // Admin only - Get contact by ID
  getContactById: async (id) => {
    try {
      const response = await api.get(`/contact/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to fetch contact';
      throw new Error(msg);
    }
  },

  // Admin only - Update contact status
  updateContactStatus: async (id, status) => {
    try {
      const response = await api.patch(`/contact/admin/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating contact status:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update contact status';
      throw new Error(msg);
    }
  },

  // Admin only - Delete contact
  deleteContact: async (id) => {
    try {
      const response = await api.delete(`/contact/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to delete contact';
      throw new Error(msg);
    }
  }
};

