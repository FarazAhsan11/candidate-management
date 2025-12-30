import api from './api';
import { getCurrentUser, setCurrentUser, removeCurrentUser, type User } from './localStorage';

const API_URL = '/auth';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export type { User };

export const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
        setCurrentUser(response.data); 
    }
    return response.data;
};

export const register = async (data: RegisterData): Promise<User> => {
    const response = await api.post(`${API_URL}/register`, data);
    if (response.data.token) {
        setCurrentUser(response.data); 
    }
    return response.data;
};

export const verifyToken = async (): Promise<Omit<User, 'token'>> => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        throw new Error('No token found');
    }

    const response = await api.get(`${API_URL}/me`);
    return response.data;
};

export const logout = () => {
    removeCurrentUser(); 
};


export { getCurrentUser };