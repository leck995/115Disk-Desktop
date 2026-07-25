<script setup lang="ts">
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import PageToc from '../components/PageToc.vue'
</script>

<template>
  <ParentLayout>
    <template #page-bottom>
      <PageToc />
    </template>
  </ParentLayout>
</template>
