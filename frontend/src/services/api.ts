import axios from 'axios';
import { getCurrentUser } from './localStorage'; 

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        const user = getCurrentUser();
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;