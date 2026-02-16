import axiosInstance from './axiosInstance';

const ADMIN_URL = import.meta.env.VITE_API_BASE_URL;

const adminService = {

    login: async (adminEmail: string, adminPassword: string) => {
        
        try {

            const response = await axiosInstance.post(`/admin/${ADMIN_URL}`, { adminEmail, adminPassword });

            if (response.status === 200) {

                // put the proper response data
                // return response.data.token;
            }
        } catch (error) {

            
            // throw new Error(error.response.data.mensagem || 'Falha ao fazer login');
        }
    }
};

export default adminService;