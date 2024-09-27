<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TransactionTable from '@/components/Tables/TransactionTable.vue';

const pageTitle = ref('Transactions Page')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-full">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <!-- Table Start-->
       <TransactionTable />
       <!-- Table End-->
    </div>
  </DefaultLayout>
</template>