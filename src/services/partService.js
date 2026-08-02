import api from './api';

export const partService = {
  getParts: async (params = {}) => {
    const response = await api.get('/parts', { params });
    return response.data;
  },

  getPart: async (id) => {
    const response = await api.get(`/parts/${id}`);
    return response.data;
  },

  compareParts: async (ids) => {
    const params = Array.isArray(ids) ? { ids: ids.join(',') } : { ids };
    const response = await api.get('/parts/compare', { params });
    return response.data;
  },

  addPart: async (formData) => {
    const response = await api.post('/parts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updatePart: async (id, data) => {
    const response = await api.put(`/parts/${id}`, data);
    return response.data;
  },

  deletePart: async (id) => {
    const response = await api.delete(`/parts/${id}`);
    return response.data;
  },

  getMyParts: async () => {
    const response = await api.get('/parts/my-parts');
    return response.data;
  },
  updatePartStatus: async (id, status) => {
    const response = await api.patch(`/parts/${id}/status`, { status });
    return response.data;
  }
};

export default partService;
