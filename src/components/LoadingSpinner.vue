<template>
    <div class="spinner-overlay" v-if="show">
      <div class="spinner"></div>
    </div>
</template>
  
<script setup>
    import { defineProps } from 'vue';
  
    const props = defineProps({
        show: {
            type: Boolean,
            required: true
        }
    });
</script>
  
<style scoped>
    .spinner-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
  
    .spinner {
        border: 8px solid rgba(0, 0, 0, 0.1);
        border-left-color: #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>  