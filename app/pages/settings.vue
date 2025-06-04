<template>
  <UserSettingsForm
    v-if="user"
    :user="user"
  />
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>
