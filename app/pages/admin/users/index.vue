<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card>
      <v-card-title class="!text-4xl">
        {{ $t('admin.user-management') }}
      </v-card-title>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>
