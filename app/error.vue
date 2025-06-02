// To edit

<template>
  <v-app>
    <v-alert
      max-width="400"
      class="text-2xl mx-auto mt-20 max-h-fit"
    >
      <v-alert-title
        class="text-8xl"
      >
        {{ error.statusCode
          ? `Error ${error.statusCode}`
          : 'Error' }}
      </v-alert-title>
      {{ error.message || 'An unexpected error occurred.' }}
    </v-alert>
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{
  error: NuxtError
}>()
</script>

<style scoped>
body {
  background-color: #f5f5f58e;
}
</style>
