import axiosInstance from './axiosInstance';

const homeAboutService = {

    fetchHomeAboutSection: async (homeAboutId: string) => {
        
        try {

            const response = await axiosInstance.get(`/homeAbout/${homeAboutId}`);

            if (response.status === 200) {
            
                // return response.data.todosAlunos;
            }
        } catch (error) {

            // also check if 401 error message appears even with the redirect from the axios interceptor

            // throw new Error(error.response.data.mensagem || 'Falha ao buscar os alunos');
        }
    },

    createHomeAboutSection: async (token: string, homeAboutContent: object) => {

        try {

            const response = await axiosInstance.post('/homeAbout', homeAboutContent, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
            
                // return response.data.mensagem;
            }
        } catch (error) {

            // throw new Error(error.response.data.mensagem || 'Falha ao criar o aluno');
        }
    },

    updateHomeAboutSection: async (token: string, homeAboutId: string, homeAboutContent: object) => {

        try {

            const response = await axiosInstance.put(`/homeAbout/${homeAboutId}`, homeAboutContent, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
            
                // return response.data.mensagem;
            }
        } catch (error) {

            // throw new Error(error.response.data.mensagem || 'Falha ao editar o aluno');
        }
    },

    deleteHomeAboutSection: async (token: string, homeAboutId: string) => {

        try {

            const response = await axiosInstance.delete(`/homeAbout/${homeAboutId}`, {
                headers: { Authorization: `Bearer ${token}` },
                // params: { homeAboutId } // in case delete endpoint doesn't accept id in the url
            });

            if (response.status === 200) {
            
                // return response.data.mensagem;
            }
        } catch (error) {

            // throw new Error(error.response.data.mensagem || 'Falha ao remover o aluno');
        }
    }
};

export default homeAboutService;