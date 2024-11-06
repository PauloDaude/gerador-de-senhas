import axios from 'axios';

const api = axios.create({
  baseURL: 'https://json-server-senha.vercel.app',
  headers: { 'Content-Type': 'application/json' }
});

export const fetchAllPasswords = async () => {
  try {
    const response = await api.get('/passwords');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar senhas:', error.message);
    return [];
  }
};

export const createPassword = async password => {
  try {
    await api.post('/passwords', password);
    return await fetchAllPasswords();
  } catch (error) {
    console.error('Erro ao criar senha:', error.message);
    return [];
  }
};

export const deletePassword = async id => {
  try {
    await api.delete(`/passwords/${id}`);
    return await fetchAllPasswords();
  } catch (error) {
    console.error('Erro ao deletar senha:', error.message);
    return [];
  }
};
