<template>
  <v-card
    :title="$t('universal.users')"
    elevation="0"
    class="px-4"
  >
    <v-autocomplete
      v-model="selectedUsersIds"
      class="px-4"
      :items="users"
      item-title="firstName"
      item-value="id"
      :loading="usersLoading"
      chips
      closable-chips
      multiple
    >
      <template #chip="{props, item}">
        <v-chip
          v-bind="props"
          :text="$t('users.user-name-with-index', [
            item.raw.firstName,
            item.raw.lastName,
            item.raw.studentIndex,
          ])"
        />
      </template>

      <template #[`item`]="{props, item}">
        <v-list-item
          v-bind="props"
          :title="$t('users.user-name-with-index', [
            item.raw.firstName,
            item.raw.lastName,
            item.raw.studentIndex,
          ])"
        />
      </template>
    </v-autocomplete>
  </v-card>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

const selectedUsers = defineModel<User[]>({ required: true })
const userStore = useUserStore()
const { user, users, loading: usersLoading } = storeToRefs(userStore)

const selectedUsersIds = ref<string[]>([])

watch(selectedUsersIds, () => {
  if (selectedUsersIds.value.length === 0 && selectedUsers.value.length !== 0) {
    selectedUsersIds.value = selectedUsers.value.map(u => u.id)
  }
  else {
    selectedUsers.value = users.value.filter(u => selectedUsersIds.value.includes(u.id))
  }
}, { immediate: true })

watch(user, async (newUser) => {
  if (!newUser)
    return

  await userStore.fetchUsers()
}, { immediate: true })
</script>
