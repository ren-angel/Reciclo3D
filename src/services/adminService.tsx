import axiosInstance from './axiosInstance';

// const ADMIN_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_URL = 'Z3ZOtDUMsy9wMXW';

const adminService = {

    login: async (adminEmail: string, adminPassword: string) => {
        
        try {

            const response = await axiosInstance.post(`/admin/${ADMIN_URL}/login`, { adminEmail, adminPassword });

            console.log(response)

            if (response.data.success) {

                return response.data.data.access_token;
            }
        } catch (error: any) {

            console.log(error)
            
            throw new Error(error.response.data.mensagem || 'Falha ao fazer login');
        }
    }
};

export default adminService;