import api from '../lib/axios';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

export const authService = {
  login: async (username: string, password: unknown): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', String(password));

    const { data } = await api.post<LoginResponse>('/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  },

  register: async (userData: RegisterData) => {
    const { data } = await api.post('/register', userData);
    return data;
  },
};
