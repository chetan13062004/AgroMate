import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('token');
  return null;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export const equipmentService = {
  getMyEquipment: async () => {
    const res = await api.get('/equipment');
    return res.data.data.equipments;
  },
  createEquipment: async (formData: FormData) => {
    const res = await api.post('/equipment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.equipment;
  },
  updateEquipment: async (id: string, formData: FormData) => {
    const res = await api.patch(`/equipment/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.equipment;
  },
  deleteEquipment: async (id: string) => {
    await api.delete(`/equipment/${id}`);
    return true;
  },
  /**
   * Fetch all equipment available for rent (public endpoint)
   */
  getAvailableEquipment: async () => {
    // Public endpoint should not send an Authorization header – using a separate instance avoids 401 if a stale token is present.
    const res = await axios.get(`${API_URL}/equipment/available`);
    return res.data.data.equipments;
  },
};

export default equipmentService;
