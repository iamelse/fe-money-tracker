<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AccountTable from '@/components/Tables/AccountTable.vue';

const pageTitle = ref('Accounts Page')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-full">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <!-- Table Start-->
       <AccountTable />
       <!-- Table End-->
    </div>
  </DefaultLayout>
</template>