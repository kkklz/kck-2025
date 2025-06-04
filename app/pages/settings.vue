<template>
  <div>
    <UserSettingsForm
      v-if="user"
      :user="user"
    />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>
