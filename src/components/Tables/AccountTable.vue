<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import EditAccountModal from '@/components/Modals/Accounts/Edit.vue';
import CreateAccountModal from '@/components/Modals/Accounts/Create.vue';
import Swal from 'sweetalert2';

const accounts = ref<any[]>([]);
const authStore = useAuthStore();
const pageSize = ref<number>(10);
const currentPage = ref<number>(1);
const searchQuery = ref<string>('');
const totalItems = ref<number>(0);
const loading = ref<boolean>(false);
const selectedAccount = ref(null);
const isCreateModalVisible = ref(false);
const isEditModalVisible = ref(false);

// Edit account
const handleEditClick = (account: any) => {
  selectedAccount.value = account;
  isEditModalVisible.value = true;
};

// New account
const handleNewAccountClick = () => {
  selectedAccount.value = null;
  isCreateModalVisible.value = true;
};

// Close modals
const handleCreateModalClose = () => {
  isCreateModalVisible.value = false;
  selectedAccount.value = null;
};

const handleEditModalClose = () => {
  isEditModalVisible.value = false;
  selectedAccount.value = null;
};

// Delete account
const handleDeleteClick = (account: any) => {
  handleDelete(account.id);
};

const handleDelete = async (accountId: number) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    try {
      const token = authStore.token;
      const apiUrl = import.meta.env.VITE_API_URL;

      await axios.delete(`${apiUrl}/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchAccounts();
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Account deleted successfully',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      Swal.fire('Error!', 'There was an issue deleting the account.', 'error');
    }
  }
};

// Create account
const handleCreateModalSave = async (newAccountData: any) => {
  try {
    const token = authStore.token;
    const apiUrl = import.meta.env.VITE_API_URL;

    await axios.post(`${apiUrl}/accounts`, newAccountData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchAccounts();
    handleCreateModalClose();

    // Toast success message for create action
    Swal.fire({
      toast: true,
      icon: 'success',
      title: 'Account created successfully',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  } catch (error) {
    console.error('Error creating account:', error.response ? error.response.data : error.message);
  }
};

// Edit account
const handleEditModalSave = async (updatedAccountData: any) => {
  try {
    const token = authStore.token;
    const apiUrl = import.meta.env.VITE_API_URL;

    await axios.put(`${apiUrl}/accounts/${selectedAccount.value.id}`, updatedAccountData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchAccounts();
    handleEditModalClose();

    // Toast success message for edit action
    Swal.fire({
      toast: true,
      icon: 'success',
      title: 'Account updated successfully',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  } catch (error) {
    console.error('Error updating account:', error);
  }
};

// Pagination and search
const pageSizeOptions = [10, 20, 30, 40, 50, 100];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

const debounce = (func: Function, wait: number) => {
  let timeout: number | null = null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

const fetchAccounts = async () => {
  loading.value = true;

  try {
    const token = authStore.token;
    const apiUrl = import.meta.env.VITE_API_URL;

    const response = await axios.get(`${apiUrl}/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search_query: searchQuery.value,
        limit: pageSize.value,
        page: currentPage.value,
      },
    });

    accounts.value = response.data.data.data;
    totalItems.value = response.data.data.total;
  } catch (error) {
    console.error('Error fetching accounts:', error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchAccounts = debounce(fetchAccounts, 500);

watch([pageSize, currentPage, searchQuery], () => {
  debouncedFetchAccounts();
});

onMounted(() => {
  fetchAccounts();
});

// Pagination methods
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (target) {
    pageSize.value = parseInt(target.value, 10);
    currentPage.value = 1;
  }
};

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    searchQuery.value = target.value;
    currentPage.value = 1;
  }
};

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    
    <div class="flex justify-end items-center pb-5">
      <button
        type="button"
        class="bg-blue-600 text-white px-4 py-2 rounded"
        @click="handleNewAccountClick"
      >
        New Account
      </button>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between mb-6">
      <div class="mb-4.5">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search accounts..."
          class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
      </div>

      <div class="mb-4.5">
        <select
          v-model="pageSize"
          @change="handlePageSizeChange"
          class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        >
          <option v-for="option in pageSizeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="spinner"></div>
    </div>

    <div v-else>
      <div v-if="accounts.length === 0" class="text-center py-4">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="py-4 px-4 font-medium text-black dark:text-white">No.</th>
              <th class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Account Name</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Account Type</th>
              <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Balance</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Created At</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Updated At</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="py-4 text-center">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>      
      <div v-else class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="py-4 px-4 font-medium text-black dark:text-white">No.</th>
              <th class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Account Name</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Account Type</th>
              <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Balance</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Created At</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Updated At</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(account, index) in accounts" :key="index">
              <td class="py-5 px-4">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </td>
              <td class="py-5 px-4 pl-9 xl:pl-11">
                <h5 class="font-medium text-black dark:text-white">{{ account.account_name }}</h5>
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
                  <!--
                  <button class="hover:text-primary" title="View">
                    <i class='bx bx-show'></i>
                  </button>
                  -->
                  <button class="hover:text-primary" title="Edit" @click="handleEditClick(account)">
                    <i class='bx bx-edit'></i>
                  </button>
                  <button class="hover:text-primary" title="Delete" @click="handleDeleteClick(account)">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end items-center p-4 sm:p-6 xl:p-7.5">
        <nav>
          <ul class="flex flex-wrap items-center gap-2">
            <li>
              <a 
                @click.prevent="handlePageChange(currentPage - 1)" 
                class="flex items-center justify-center rounded bg-[#EDEFF1] px-3 py-1.5 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white" 
                :class="{ 'cursor-not-allowed': currentPage === 1 }" 
                href="#"
              >
                Previous
              </a>
            </li>
            <li v-for="page in pageNumbers" :key="page">
              <a 
                @click.prevent="handlePageChange(page)" 
                class="flex items-center justify-center rounded px-3 py-1.5 font-medium hover:bg-primary hover:text-white" 
                :class="{ 'bg-primary text-white': page === currentPage }" 
                href="#"
              >
                {{ page }}
              </a>
            </li>
            <li>
              <a 
                @click.prevent="handlePageChange(currentPage + 1)" 
                class="flex items-center justify-center rounded bg-[#EDEFF1] px-3 py-1.5 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white" 
                :class="{ 'cursor-not-allowed': currentPage === totalPages }" 
                href="#"
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

  <CreateAccountModal
      :isVisible="isCreateModalVisible"
      :account="selectedAccount || { account_name: '', account_type: '', balance: 0 }"
      @close="handleCreateModalClose"
      @save="handleCreateModalSave"
  />

  <EditAccountModal
      :isVisible="isEditModalVisible"
      :account="selectedAccount || { account_name: '', account_type: '', balance: 0 }"
      @close="handleEditModalClose"
      @save="handleEditModalSave"
  />
</template>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3d55dd;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>