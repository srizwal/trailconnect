import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tc_token');
      localStorage.removeItem('tc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  googleAuth: (data) => API.post('/auth/google', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Treks
export const trekAPI = {
  getAll: (params) => API.get('/treks', { params }),
  getFeatured: () => API.get('/treks/featured'),
  getOne: (id) => API.get(`/treks/${id}`),
  create: (data) => API.post('/treks', data),
  update: (id, data) => API.put(`/treks/${id}`, data),
  delete: (id) => API.delete(`/treks/${id}`),
  join: (id) => API.post(`/treks/${id}/join`),
  leave: (id) => API.post(`/treks/${id}/leave`),
  like: (id) => API.post(`/treks/${id}/like`),
  comment: (id, text) => API.post(`/treks/${id}/comment`, { text }),
};

// Guides
export const guideAPI = {
  getAll: (params) => API.get('/guides', { params }),
  getOne: (id) => API.get(`/guides/${id}`),
  getMyProfile: () => API.get('/guides/me'),
  create: (data) => API.post('/guides', data),
  update: (data) => API.put('/guides/me', data),
};

// Bookings
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/me'),
  getOne: (id) => API.get(`/bookings/${id}`),
  cancel: (id, reason) => API.put(`/bookings/${id}/cancel`, { reason }),
};

// Users
export const userAPI = {
  getProfile: (id) => API.get(`/users/${id}`),
  follow: (id) => API.post(`/users/${id}/follow`),
  getUserTreks: (id) => API.get(`/users/${id}/treks`),
};

// Reviews
export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
  getGuideReviews: (guideId) => API.get(`/reviews/guide/${guideId}`),
};

// Messages
export const messageAPI = {
  getConversation: (roomId) => API.get(`/messages/${roomId}`),
  send: (data) => API.post('/messages', data),
};

// Notifications
export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  readAll: () => API.put('/notifications/read-all'),
};

// Admin
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  verifyGuide: (id) => API.put(`/admin/guides/${id}/verify`),
  banUser: (id) => API.put(`/admin/users/${id}/ban`),
  featureTrek: (id, featured) => API.put(`/admin/treks/${id}/feature`, { featured }),
};

export default API;
