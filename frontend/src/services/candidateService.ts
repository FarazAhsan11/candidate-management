import axios from 'axios';
import type { Candidate } from '../types/candidate';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});


export interface CandidateQueryParams {
  search?: string;      
  position?: string;    
  status?: string;    
  experience?: string; 
  sortBy?: string;      
  page?: number;      
  limit?: number;     
}

export interface CandidateResponse {
  candidates: Candidate[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  positions: string[];  
}

export const candidateService = {

  getAll: async (params?: CandidateQueryParams): Promise<CandidateResponse> => {
    const response = await api.get('/candidates', { params });
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
