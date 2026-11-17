import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const getMe = async () => {
  const { data } = await api.get('/me');
  return data;
};

export const getFeed = async () => {
  const { data } = await api.get('/feed');
  return data;
};

export const postSwipe = async (profileId, action) => {
  const { data } = await api.post('/swipe', { profileId, action });
  return data;
};

export const getMatches = async () => {
  const { data } = await api.get('/matches');
  return data;
};

export default api;
