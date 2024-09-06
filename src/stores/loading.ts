import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isSubmitting: false,
  }),
  actions: {
    setLoading(value: boolean) {
      this.isSubmitting = value;
    },
  },
});