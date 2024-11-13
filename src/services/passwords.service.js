import axios from 'axios';

// const url = 'http://localhost:3000';

const api = axios.create({
  baseURL: 'https://json-server-senha.vercel.app',
  headers: { 'Content-Type': 'application/json' }
});

export const fetchAllPasswords = async () => {
  const passwords = await api.get('/passwords').then(response => response.data);
  return passwords;
};

export const createPassword = async password => {
  return await api.post('/passwords', password).then(response => response.data);
};

export const deletePassword = async id => {
  return await api.delete(`/passwords/${id}`).then(response => response.data);
};
