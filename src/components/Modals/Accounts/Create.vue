<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <h3 class="text-lg font-medium mb-4">Create New Account</h3>
      <form @submit.prevent="save">
        <div class="mb-4">
          <label for="accountName" class="block text-sm font-medium mb-1">Account Name</label>
          <input 
            v-model="account.account_name" 
            type="text" 
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Account Name" 
            required />
        </div>
        <div class="mb-4">
          <label for="accountName" class="block text-sm font-medium mb-1">Account Type</label>
          <input 
            v-model="account.account_type" 
            type="text"
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Account Type" 
            required />
        </div>
        <div class="mb-4">
          <label for="accountName" class="block text-sm font-medium mb-1">Account Type</label>
          <input 
            v-model="account.balance" 
            type="number" 
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Balance" 
            required />
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
              Create Account
            </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
    isVisible: boolean
    account: any
}>()
const emit = defineEmits(['close', 'save'])

const close = () => {
    emit('close')
}

const save = () => {
    emit('save', props.account)
}
</script>

<style scoped>
/* Add your styles here */
</style>