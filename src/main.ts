import './assets/css/satoshi.css';
import './assets/css/style.css';
import 'jsvectormap/dist/css/jsvectormap.min.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'boxicons/css/boxicons.min.css';

import VueApexCharts from 'vue3-apexcharts';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { setupAuthRefreshListener } from './utils/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueApexCharts);

const API_URL = import.meta.env.VITE_API_URL;

const initializeAuthStore = async () => {
  const authStore = useAuthStore(pinia);
  authStore.initialize();
  const token = localStorage.getItem('authToken');

  if (token) {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data.data;
      
      if (user) {
        authStore.login(token, user);
      } else {
        authStore.logout();
      }
    } catch (error) {
      console.error('Failed to fetch user from token:', error);
      authStore.logout();
    }
  } else {
    authStore.logout();
  }
};

setupAuthRefreshListener();

initializeAuthStore().finally(() => {
  app.mount('#app');
});