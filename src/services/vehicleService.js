import api from './api';

export const vehicleService = {
  getVehicles: async (params = {}) => {
    const response = await api.get('/parts', { params });
    return response.data;
  },

  getVehicle: async (id) => {
    const response = await api.get(`/parts/${id}`);
    return response.data;
  },

  compareVehicles: async (ids) => {
    const params = Array.isArray(ids) ? { ids: ids.join(',') } : { ids };
    const response = await api.get('/parts/compare', { params });
    return response.data;
  },

  addVehicle: async (formData) => {
    const response = await api.post('/parts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateVehicle: async (id, data) => {
    const response = await api.put(`/parts/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/parts/${id}`);
    return response.data;
  },

  getMyVehicles: async () => {
    const response = await api.get('/parts/my-parts');
    return response.data;
  },
  updateVehicleStatus: async (id, status) => {
  const response = await api.patch(`/parts/${id}/status`, { status });
  return response.data;
}
};