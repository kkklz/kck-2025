<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card>
      <v-card-title class="!text-4xl">
        {{ $t('admin.main-view') }}
      </v-card-title>

      <v-card-text>
        {{ $t('admin.welcome', {'name': user?.firstName}) }}
      </v-card-text>

      <v-card-title>
        {{ $t('admin.statistics') }}
      </v-card-title>

      <v-card-text>
        {{ $t('admin.registered-users-number') }}
        <v-chip
          color="green"
          label
        >
          {{ registeredUsersNumber }}
        </v-chip>

        <br>
        {{ $t('admin.courses-number') }}
        <v-chip
          color="green"
          label
        >
          {{ courseNumber }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-btn
      to="/"
      variant="tonal"
      width="fit-content"
    >
      {{ $t('admin.back-to-home') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const courseNumber = ref(13)
const registeredUsersNumber = ref(5)
</script>
