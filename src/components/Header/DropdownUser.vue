<template>
  <div class="relative" ref="target">
    <router-link
      class="flex items-center gap-4"
      to="#"
      @click.prevent="toggleDropdown"
    >
      <span class="hidden text-right lg:block" v-if="user">
        <span class="block text-sm font-medium text-black dark:text-white">{{ user.name }}</span>
        <span class="block text-xs font-medium">{{ user.email }}</span>
      </span>
      <span class="hidden text-right lg:block" v-else>
        <span class="block text-sm font-medium text-black dark:text-white">Guest</span>
        <span class="block text-xs font-medium">Please log in</span>
      </span>
      <span class="h-12 w-12 rounded-full">
        <img src="@/assets/images/user/user-01.png" alt="User" />
      </span>
      <svg
        :class="{'rotate-180': dropdownOpen}"
        class="hidden fill-current sm:block transition-transform duration-300"
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
          fill=""
        />
      </svg>
    </router-link>

    <!-- Dropdown Start -->
    <div
      v-show="dropdownOpen"
      class="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <ul class="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
        <li>
          <router-link
            to="/profile"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <i class='bx bx-user'></i>
            My Profile
          </router-link>
        </li>
        <li>
          <router-link
            to="#"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <i class='bx bx-book'></i>
            My Contacts
          </router-link>
        </li>
        <li>
          <router-link
            to="/pages/settings"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <i class='bx bx-cog'></i>
            Account Settings
          </router-link>
        </li>
      </ul>
      <button
        class="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        @click="logout"
      >
        <i class='bx bx-log-out'></i>
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { useRouter } from 'vue-router';

const target = ref<HTMLElement | null>(null);
const dropdownOpen = ref(false);
const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const router = useRouter();

const user = computed(() => authStore.user);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

onClickOutside(target, () => {
  dropdownOpen.value = false;
});

const logout = async () => {
  try {
    loadingStore.setLoading(true);
    authStore.logout();  // Make sure authStore.logout correctly clears state

    // Delay navigation to ensure state updates
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 100); // 100ms delay for state to update
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    loadingStore.setLoading(false);
  }
};
</script>

<style>
i {
  font-size: 1.45rem; 
}
</style>
