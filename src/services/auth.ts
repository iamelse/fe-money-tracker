import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const authStore = useAuthStore();

  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    const { token, user } = response.data.data;

    localStorage.setItem('authToken', token);
    authStore.login(token, user);

    return { token, user };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'An error occurred during login';
      throw new Error(message);
    } else {
      throw new Error((error as Error).message || 'An error occurred during login');
    }
  }
}

export async function fetchUserFromToken() {
  const authStore = useAuthStore();
  const token = localStorage.getItem('authToken');

  if (!token) {
    authStore.logout();
    throw new Error('Token not found');
  }

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = response.data.data;

    if (user) {
      authStore.login(token, user);
      return user;
    } else {
      authStore.logout();
      throw new Error('User not found');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      authStore.logout();
      throw new Error(message);
    } else {
      authStore.logout();
      throw new Error((error as Error).message || 'Failed to fetch user');
    }
  }
}

export async function logout() {
  const authStore = useAuthStore();
  const token = localStorage.getItem('authToken');

  try {
    if (token) {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    
    authStore.logout();
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('An error occurred during logout:', error);
  }
}
