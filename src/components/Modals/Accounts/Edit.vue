<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 class="text-lg font-medium mb-4">Edit Account</h3>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="accountName" class="block text-sm font-medium mb-1">Account Name</label>
            <input
              v-model="accountData.account_name"
              id="accountName"
              type="text"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div class="mb-4">
            <label for="accountType" class="block text-sm font-medium mb-1">Account Type</label>
            <input
              v-model="accountData.account_type"
              id="accountType"
              type="text"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div class="mb-4">
            <label for="balance" class="block text-sm font-medium mb-1">Balance</label>
            <input
              v-model="accountData.balance"
              id="balance"
              type="number"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="handleClose"
              class="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  isVisible: boolean
  account: {
    account_name: string
    account_type: string
    balance: number
  }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: { account_name: string; account_type: string; balance: number }): void
}>()

const accountData = ref({ ...props.account })

watch(() => props.account, (newAccount) => {
  accountData.value = { ...newAccount }
}, { immediate: true })

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('save', accountData.value)
}
</script>

<style scoped>
/* Add your styles here */
</style>
