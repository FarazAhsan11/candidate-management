import axios from 'axios';
import type { Candidate } from '../types/candidate';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const candidateService = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await api.get('/candidates');
    return response.data;
  },

  getById: async (id: string): Promise<Candidate> => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Candidate> => {
    const response = await api.post('/candidates', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.candidate;
  },

  update: async (id: string, data: Partial<Candidate>): Promise<Candidate> => {
    const response = await api.patch(`/candidates/${id}`, data);
    return response.data.candidate;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};
