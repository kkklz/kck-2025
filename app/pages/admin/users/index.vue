<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card
      class="pa-4"
    >
      <v-card-title class="mb-4 !text-4xl">
        {{ $t('admin.user-management') }}
      </v-card-title>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="user in users"
          :key="user.id"
          link
          :prepend-avatar="user?.photoUrl || '/default-avatar.webp'"
        >
          <v-list-item-title>
            {{ user.firstName }} {{ user.lastName }}
            <v-chip
              v-if="user.role === 'admin'"
              class="bg-red"
              density="compact"
            >
              {{ $t('admin.admin').toUpperCase() }}
            </v-chip>
          </v-list-item-title>

          <v-list-item-subtitle v-if="user.studentIndex">
            {{ user.studentIndex }}
          </v-list-item-subtitle>

          <template #append>
            <v-btn
              variant="plain"
              link
              :to="`/admin/users/${user.id}`"
            >
              {{ $t('universal.settings') }}
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const userStore = useUserStore()
const { users } = storeToRefs(userStore)

onBeforeMount(() => {
  userStore.fetchUsers()
})
</script>
