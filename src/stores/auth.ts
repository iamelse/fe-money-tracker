import { defineStore } from 'pinia';
import type { User } from '@/type';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: '',
    user: null as User | null
  }),
  actions: {
    async initialize() {
      try {
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
        this.isAuthenticated = storedIsAuthenticated ? JSON.parse(storedIsAuthenticated) : false;
      } catch (error) {
        console.error('Failed to parse isAuthenticated from localStorage:', error);
        this.isAuthenticated = false;
      }
      
      this.token = localStorage.getItem('authToken') || '';
      
      try {
        const storedUser = localStorage.getItem('user');
        this.user = storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        this.user = null;
      }
    },
    async login(token: string, user: User) {
      this.isAuthenticated = true;
      this.token = token;
      this.user = user;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      localStorage.setItem('user', JSON.stringify(user));
    },
    async logout() {
      this.isAuthenticated = false;
      this.token = '';
      this.user = null;
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  }
});
