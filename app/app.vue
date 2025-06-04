<template>
  <v-app class="font-roboto antialiased">
    <AppBar />

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
  authStore.setupAuthListener()
})
</script>

<style>
.page-enter-active,
.page-leave-active,
.layout-enter-active,
.layout-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from,
.layout-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  filter: blur(2px);
}
.page-leave-to,
.layout-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
  filter: blur(2px);
}
</style>
