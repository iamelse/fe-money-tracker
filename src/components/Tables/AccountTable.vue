<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const accounts = ref<any[]>([])
const authStore = useAuthStore()
const pageSize = ref(10)

const pageSizeOptions = [5, 10, 20, 30, 40, 50, 100]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

const fetchAccounts = async () => {
  if (!authStore.isAuthenticated) {
    console.error('User is not authenticated')
    return
  }

  try {
    const token = authStore.token
    const apiUrl = import.meta.env.VITE_API_URL

    const response = await axios.get(`${apiUrl}/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    accounts.value = response.data.data
    
  } catch (error) {
    console.error('Error fetching accounts:', error)
  }
}

onMounted(() => {
  fetchAccounts()
})
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <!-- Search Filter -->
    <div class="flex flex-col sm:flex-row items-center justify-between mb-6">
      <!-- Page Size Selector -->
      <div class="relative w-full sm:w-1/4 mb-4 sm:mb-0">
        <select 
          v-model="pageSize" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
          <i class="bx bx-cog"></i>
        </span>
      </div>
      <div class="relative w-full sm:w-1/3">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"
        />
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
          <i class="bx bx-search"></i>
        </span>
      </div>
    </div>
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-2 text-left dark:bg-meta-4">
            <th class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Account Name
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Account Type
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Balance
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Created At
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Updated At
            </th>
            <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(account, index) in accounts" :key="index">
            <td class="py-5 px-4 pl-9 xl:pl-11">
              <h5 class="font-medium text-black dark:text-white">{{ account.account_name }}</h5>
              <p class="text-sm">{{ account.account_type }}</p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">{{ account.account_type }}</p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">{{ account.balance }}</p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">{{ formatDate(account.created_at) }}</p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">{{ formatDate(account.updated_at) }}</p>
            </td>
            <td class="py-5 px-4">
              <div class="flex items-center space-x-3.5">
                <button class="hover:text-primary" title="View">
                  <i class='bx bx-eye'></i>
                </button>
                <button class="hover:text-primary" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="hover:text-primary" title="Delete">
                  <i class='bx bx-trash'></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>