import axiosInstance from './axiosInstance';
import axios from 'axios';

const homeServicesService = {

    fetchHomeServicesSection: async () => {
        
        try {

            const response = await axiosInstance.get(`/homeServices`);

            if (response.data.success) {
            
                return response.data.data.section;
            }
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Falha ao buscar a seção "Serviços"'
                );
            }

            throw new Error('Erro inesperado');
        }
    },

    // createHomeServicesSection: async (token: string, homeServicesContent: object) => {

    //     try {

    //         const response = await axiosInstance.post('/homeServices', homeServicesContent, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         if (response.data.success) {
            
    //             // return response.data.mensagem;
    //         }
    //     } catch (error) {

    //         // throw new Error(error.response.data.mensagem || 'Falha ao criar o aluno');
    //     }
    // },

    updateHomeServicesSection: async (token: string, homeServicesContentText: object) => {

        try {

            const response = await axiosInstance.put('/homeServices/1', homeServicesContentText, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
            
                return response.data.data.message;
            }
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Falha ao atualizar a seção "Serviços'
                );
            }

            throw new Error('Erro inesperado');
        }
    },

    // deleteHomeServicesSection: async (token: string, homeServicesId: string) => {

    //     try {

    //         const response = await axiosInstance.delete(`/homeServices/${homeServicesId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //             // params: { homeServicesId } // in case delete endpoint doesn't accept id in the url
    //         });

    //         if (response.data.success) {
            
    //             // return response.data.mensagem;
    //         }
    //     } catch (error) {

    //         // throw new Error(error.response.data.mensagem || 'Falha ao remover o aluno');
    //     }
    // }
};

export default homeServicesService;