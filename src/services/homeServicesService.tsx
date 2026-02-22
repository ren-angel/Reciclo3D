import axiosInstance from './axiosInstance';

const homeServicesService = {

    fetchHomeServicesSection: async (homeServicesId: string) => {
        
        try {

            const response = await axiosInstance.get(`/homeServices/${homeServicesId}`);

            if (response.status === 200) {
            
                // return response.data.todosAlunos;
            }
        } catch (error) {

            // also check if 401 error message appears even with the redirect from the axios interceptor

            // throw new Error(error.response.data.mensagem || 'Falha ao buscar os alunos');
        }
    },

    createHomeServicesSection: async (token: string, homeServicesContent: object) => {

        try {

            const response = await axiosInstance.post('/homeServices', homeServicesContent, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
            
                // return response.data.mensagem;
            }
        } catch (error) {

            // throw new Error(error.response.data.mensagem || 'Falha ao criar o aluno');
        }
    },

    updateHomeServicesSection: async (token: string, homeServicesId: string, homeServicesContent: object) => {

        try {

            const response = await axiosInstance.put(`/homeServices/${homeServicesId}`, homeServicesContent, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
            
                // return response.data.mensagem;
            }
        } catch (error) {

            // throw new Error(error.response.data.mensagem || 'Falha ao editar o aluno');
        }
    },

    deleteHomeServicesSection: async (token: string, homeServicesId: string) => {

        try {

            const response = await axiosInstance.delete(`/homeServices/${homeServicesId}`, {
                headers: { Authorization: `Bearer ${token}` },
                // params: { homeServicesId } // in case delete endpoint doesn't accept id in the url
            });

            if (response.status === 200) {
            
                // return response.data.mensagem;
            }
        } catch (error) {

            // throw new Error(error.response.data.mensagem || 'Falha ao remover o aluno');
        }
    }
};

export default homeServicesService;