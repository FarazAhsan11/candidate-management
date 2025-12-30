import api from './api';

interface AdminStats {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    recentUsers: number;
    totalCandidates: number;
    pendingReviews: number;
}

interface AdminStatsResponse {
    success: boolean;
    data: AdminStats;
}

export const adminService = {
    getStats: async (): Promise<AdminStats> => {
        const response = await api.get<AdminStatsResponse>('/auth/admin/stats');
        return response.data.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data.data;
    },

    addUser: async (userData: { name: string; email: string; password: string; role: string }) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    updateUser: async (userId: string, userData: any) => {
        const response = await api.put(`/auth/users/${userId}`, userData);
        return response.data;
    },

    deleteUser: async (userId: string) => {
        const response = await api.delete(`/auth/users/${userId}`);
        return response.data;
    }
};
