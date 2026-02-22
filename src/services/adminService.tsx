import axiosInstance from './axiosInstance';
import axios from 'axios';

// const ADMIN_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_URL = 'Z3ZOtDUMsy9wMXW';

const adminService = {

    login: async (adminEmail: string, adminPassword: string) => {
        
        try {

            const response = await axiosInstance.post(`/admin/${ADMIN_URL}/login`, { adminEmail, adminPassword });

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