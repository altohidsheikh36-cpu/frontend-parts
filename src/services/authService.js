import api from './api';

export const authService = {
  login: async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success) {
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
},

register: async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success) {
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
},


  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // ✅ Updated version — fetches fresh user data from backend
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      const user = response.data.data; // includes createdAt now
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return JSON.parse(localStorage.getItem('user'));
    }
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
