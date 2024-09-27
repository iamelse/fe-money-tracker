<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <h3 class="text-lg font-medium mb-4">Edit Transaction</h3>
      <form @submit.prevent="save">
        <!-- Account ID Select -->
        <div class="mb-4 relative">
          <label for="accountId" class="block text-sm font-medium mb-1">Account</label>
          <select 
            v-model="transaction.account_id" 
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 pr-10 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary appearance-none"
            required>
            <option disabled value="">Select Account</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.account_name }}
            </option>
          </select>
          <!-- Arrow down icon -->
          <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Other form fields -->
        <div class="mb-4">
          <label for="amount" class="block text-sm font-medium mb-1">Amount</label>
          <input 
            v-model="transaction.amount" 
            type="number" 
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Transaction Amount" 
            required />
        </div>
        <div class="mb-4">
          <label for="transactionDate" class="block text-sm font-medium mb-1">Transaction Date</label>
          <input 
            v-model="transaction.transaction_date" 
            type="datetime-local" 
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Transaction Date" 
            required />
        </div>
        <div class="mb-4">
          <label for="category" class="block text-sm font-medium mb-1">Category</label>
          <input 
            v-model="transaction.category" 
            type="text" 
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Category" 
            required />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium mb-1">Description</label>
          <textarea 
            v-model="transaction.description" 
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Description" 
            rows="3"></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="close"
            class="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Props and emits
const props = defineProps<{
  isVisible: boolean
  transaction: any
}>()
const emit = defineEmits(['close', 'save'])

const close = () => {
  emit('close')
}

const save = () => {
  emit('save', props.transaction)
}

// Store and reactive data
const authStore = useAuthStore()
const accounts = ref([])
const loading = ref(false)

// Fetch accounts from the API
const fetchAccounts = async () => {
  loading.value = true
  try {
    const token = authStore.token
    const apiUrl = import.meta.env.VITE_API_URL

    const response = await axios.get(`${apiUrl}/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search_query: '', // Placeholder if you want to implement search
        limit: 10, // Page size
        page: 1, // Default to the first page
      },
    })

    accounts.value = response.data.data.data // Assuming the API returns the correct structure
  } catch (error) {
    console.error('Error fetching accounts:', error)
  } finally {
    loading.value = false
  }
}

// Fetch accounts when component mounts
onMounted(() => {
  fetchAccounts()
})
</script>

<style scoped>
/* Add your styles here */
</style>