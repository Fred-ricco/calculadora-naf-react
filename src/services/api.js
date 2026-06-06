import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export function listarHistorico() {
  const token = localStorage.getItem('token');

  return api.get('/calculos', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export default api;