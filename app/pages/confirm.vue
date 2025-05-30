<script setup lang="ts">
const user = useSupabaseUser()
watch (user, () => {
  if (user.value)
    return navigateTo('/')

  return null
}, { immediate: true })
</script>

<template>
  <v-skeleton-loader type="card" />

  <v-skeleton-loader type="card" />

  <v-skeleton-loader type="card" />

  <v-skeleton-loader type="card" />
</template>
