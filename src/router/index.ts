import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/Authentication/LoginView.vue';
import MoneyTrackerView from '@/views/Dashboard/MoneyTrackerView.vue';
import NotFound from '@/views/NotFound.vue';
import AccountsView from '@/views/Pages/AccountsView.vue';
import SettingsView from '@/views/Pages/SettingsView.vue';

const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: MoneyTrackerView,
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  {
    path: '/dashboard/accounts',
    name: 'accounts',
    component: AccountsView,
    meta: { title: 'Accounts', requiresAuth: true }
  },
  {
    path: '/dashboard/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: 'Settings', requiresAuth: true }
  },
  {
    path: '/auth/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login', requiresAuth: false }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  }
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  //console.log('Navigating to:', to.path);
  //console.log('Requires auth:', to.meta.requiresAuth);
  //console.log('Is authenticated:', isAuthenticated);

  document.title = `${to.meta.title} | Money Tracker`;

  if (to.meta.requiresAuth && !isAuthenticated) {
    //console.log('Redirecting to login');
    next({ name: 'login' });
  } else if (!to.meta.requiresAuth && isAuthenticated) {
    //console.log('Redirecting to dashboard');
    next({ name: 'dashboard' });
  } else {
    //console.log('Proceeding to route');
    next();
  }
});

export default router;