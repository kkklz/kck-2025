<template>
  <v-app class="font-roboto antialiased">
    <NuxtLayout>
      <v-main>
        <NuxtPage />
      </v-main>
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

onBeforeMount(() => {
  authStore.init()
})
</script>
