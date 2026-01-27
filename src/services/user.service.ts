import api from '../lib/axios';
import type { User } from '../types/auth';

export interface UpdateUserData {
  name: string;
  password?: string;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>('/user');
    return data;
  },

  updateProfile: async (userData: UpdateUserData): Promise<User> => {
    const { data } = await api.patch<User>('/user', userData);
    return data;
  },

  resendConfirmation: async (email: string): Promise<void> => {
    await api.post('/resend-confirmation', { email });
  },
};
