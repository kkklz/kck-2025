<template>
  <div>
    <UserSettingsForm
      v-if="user"
      :user="user"
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

definePageMeta({
  layout: 'admin',
})
const userId = useRoute().params.id as string
const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const user = ref<User | null>(null)

onBeforeMount(async () => {
  await userStore.fetchUsers()
  user.value = users.value.find(u => u.id === userId) || null
})
</script>
