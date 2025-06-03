<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card class="pa-4">
      <v-card-title class="!text-4xl">
        {{ $t('admin.main-view') }}
      </v-card-title>

      <v-card-text class="!text-2xl">
        {{ $t('admin.welcome', {'name': user?.firstName}) }}
      </v-card-text>

      <v-divider />

      <v-skeleton-loader
        class="!block"
        type="article"
        :loading="loading"
      >
        <v-list density="compact">
          <v-list-item
            class="text-2xl"
            prepend-icon="mdi-chart-bar"
          >
            {{ $t('admin.statistics') }}
          </v-list-item>

          <v-list-item prepend-icon="mdi-circle-small">
            {{ $t('admin.registered-users-number') }}
            <v-chip
              class="bg-green"
              label
            >
              {{ registeredUsersNumber }}
            </v-chip>
          </v-list-item>

          <v-list-item prepend-icon="mdi-circle-small">
            {{ $t('admin.courses-number') }}
            <v-chip
              class="my-2 bg-secondary"
              label
            >
              {{ courseNumber }}
            </v-chip>
          </v-list-item>

          <v-list-item prepend-icon="mdi-circle-small">
            {{ $t('admin.quizzes-number') }}
            <v-chip
              class="bg-green"
              label
            >
              {{ quizNumber }}
            </v-chip>
          </v-list-item>
        </v-list>
      </v-skeleton-loader>
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
const courseStore = useCourseStore()
const { user, users } = storeToRefs(userStore)
const { courses } = storeToRefs(courseStore)
const registeredUsersNumber = ref(0)
const courseNumber = ref(0)
const quizNumber = ref(0)
const loading = ref(true)

onBeforeMount(async () => {
  await userStore.fetchUsers()
  await courseStore.fetchCourses('all')
  registeredUsersNumber.value = users.value.length
  courseNumber.value = courses.value.length
  quizNumber.value = courses.value.reduce((acc, course) => acc + course.quizzes.length, 0)
  loading.value = false
})
</script>
