<script setup lang="ts">
import { RouterView } from 'vue-router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
</script>

<template>
  <RouterView />
  <LoadingSpinner :show="loadingStore.isSubmitting" />
</template>