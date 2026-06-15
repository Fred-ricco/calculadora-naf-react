const API_URL = 'http://localhost:3001';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.mensagem ||
      data.message ||
      data.erro ||
      'Erro ao comunicar com o servidor.'
    );

    error.response = { data };
    throw error;
  }

  return data;
}

const api = {
  async post(path, body, options = {}) {
    const data = await request(path, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: options.headers || {},
    });

    return { data };
  },

  async get(path, options = {}) {
    const data = await request(path, {
      method: 'GET',
      headers: options.headers || {},
    });

    return { data };
  },
};

export function loginUsuario({ email, senha }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export function cadastrarUsuario({ nome, email, senha }) {
  return request('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha }),
  });
}

export function salvarToken(token) {
  localStorage.setItem('token', token);
}

export function obterToken() {
  return localStorage.getItem('token');
}

export function removerToken() {
  localStorage.removeItem('token');
}

export default api;