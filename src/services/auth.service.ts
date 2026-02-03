import api from '../lib/axios';

export interface LoginResponse {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  // tokens are now handled via httpOnly cookies
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

  refresh: async (): Promise<void> => {
    await api.post('/refresh');
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  register: async (userData: RegisterData) => {
    const { data } = await api.post('/register', userData);
    return data;
  },

  confirmEmail: async (token: string) => {
    const { data } = await api.get(`/confirm/${token}`);
    return data;
  },
};
