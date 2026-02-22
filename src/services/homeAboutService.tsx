import axiosInstance from './axiosInstance';
import axios from 'axios';

const homeAboutService = {

    fetchHomeAboutSection: async () => {
        
        try {

            const response = await axiosInstance.get(`/homeAbout`);

            if (response.data.success) {
            
                return response.data.data.section;
            }
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Falha ao buscar a seção "Sobre Nós"'
                );
            }

            throw new Error('Erro inesperado');
        }
    },

    // createHomeAboutSection: async (token: string, homeAboutContent: object) => {

    //     try {

    //         const response = await axiosInstance.post('/homeAbout', homeAboutContent, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         if (response.data.success) {
            
    //             // return response.data.mensagem;
    //         }
    //     } catch (error) {

    //         // throw new Error(error.response.data.mensagem || 'Falha ao criar o aluno');
    //     }
    // },

    updateHomeAboutSection: async (token: string, homeAboutContentText: object) => {

        try {

            const response = await axiosInstance.put('/homeAbout/1', homeAboutContentText, {
                headers: { Authorization: `Bearer ${token}` }
            });


            if (response.data.success) {
            
                return response.data.data.message;
            }
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Falha ao atualizar a seção "Sobre Nós"'
                );
            }

            throw new Error('Erro inesperado');
        }
    },

    // deleteHomeAboutSection: async (token: string, homeAboutId: string) => {

    //     try {

    //         const response = await axiosInstance.delete(`/homeAbout/${homeAboutId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //             // params: { homeAboutId } // in case delete endpoint doesn't accept id in the url
    //         });

    //         if (response.data.success) {
            
    //             // return response.data.mensagem;
    //         }
    //     } catch (error) {

    //         // throw new Error(error.response.data.mensagem || 'Falha ao remover o aluno');
    //     }
    // }
};

export default homeAboutService;