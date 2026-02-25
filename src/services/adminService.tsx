import axiosInstance from './axiosInstance';
import axios from 'axios';

// const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL;
const API_ADMIN_URL = "Z3ZOtDUMsy9wMXW";

const adminService = {

    login: async (adminEmail: string, adminPassword: string) => {
        
        try {

            const response = await axiosInstance.post(`/admin/${API_ADMIN_URL}/login`, { adminEmail, adminPassword });

            if (response.data.success) {

                return response.data.data.access_token;
            }
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Falha ao fazer login'
                );
            }

            throw new Error('Erro inesperado');
        }
    }
};

export default adminService;
