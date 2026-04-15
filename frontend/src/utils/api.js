import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ax_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('ax_refresh');
        const accountType  = localStorage.getItem('ax_type');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken, accountType });
        localStorage.setItem('ax_token', data.token);
        localStorage.setItem('ax_refresh', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  registerUser: (data) => api.post('/auth/register/user', data),
  registerOrg:  (data) => api.post('/auth/register/org', data),
  login:        (data) => api.post('/auth/login', data),
  logout:       (data) => api.post('/auth/logout', data),
  me:           ()     => api.get('/auth/me'),
};

export const usersAPI = {
  getAll:           (params) => api.get('/users', { params }),
  getByUsername:    (username) => api.get(`/users/${username}`),
  updateProfile:    (data) => api.put('/users/profile', data),
  addGameProfile:   (data) => api.put('/users/game-profile', data),
  addAchievement:   (data) => api.post('/users/achievement', data),
  addPortfolioItem: (data) => api.post('/users/portfolio', data),
};

export const orgsAPI = {
  getAll:        (params) => api.get('/orgs', { params }),
  getBySlug:     (slug)   => api.get(`/orgs/${slug}`),
  updateProfile: (data)   => api.put('/orgs/profile', data),
};

export const jobsAPI = {
  getAll:   (params)    => api.get('/jobs', { params }),
  getById:  (id)        => api.get(`/jobs/${id}`),
  create:   (data)      => api.post('/jobs', data),
  update:   (id, data)  => api.put(`/jobs/${id}`, data),
  close:    (id)        => api.delete(`/jobs/${id}`),
};

export const applyAPI = {
  apply:        (jobId, data) => api.post(`/apply/${jobId}`, data),
  getMyApps:    ()            => api.get('/apply/my'),
  getJobApps:   (jobId)       => api.get(`/apply/job/${jobId}`),
  updateStatus: (appId, data) => api.put(`/apply/${appId}/status`, data),
};

export const postsAPI = {
  getAll:  (params)    => api.get('/posts', { params }),
  create:  (data)      => api.post('/posts', data),
  like:    (id)        => api.put(`/posts/${id}/like`),
  comment: (id, data)  => api.post(`/posts/${id}/comment`, data),
};

export const gamesAPI = {
  getAll:      () => api.get('/games'),
  getById:     (id) => api.get(`/games/${id}`),
  getRoles:    () => api.get('/games/roles'),
  getDevices:  () => api.get('/games/devices'),
  getStates:   () => api.get('/games/states'),
  getJobFields:() => api.get('/games/job-fields'),
};

export const searchAPI = {
  search: (q, type) => api.get('/search', { params: { q, type } }),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadVideo: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/upload/video', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export default api;
