<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card
      class="pa-4"
    >
      <v-card-title class="!text-4xl">
        {{ $t('admin.course-management') }}
      </v-card-title>

      <v-card-text>
        <v-btn
          class="my-2"
          color="primary"
          link
          to="/admin/courses/new-course"
        >
          {{ $t('admin.add-new-course') }}
        </v-btn>
      </v-card-text>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="course in courses"
          :key="course.id"
          link
          prepend-icon="mdi-text-box-multiple"
        >
          <v-list-item-title>
            {{ course.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ course.description }}
          </v-list-item-subtitle>

          <v-list-item-subtitle class="my-2 gap-2 !flex">
            <v-chip
              label
              density="compact"
              prepend-icon="mdi-file-document"
              variant="elevated"
              class="bg-primary"
            >
              {{ $t('admin.quizes-number', [
                course.quizzes.length,
              ]) }}
            </v-chip>

            <v-chip
              label
              density="compact"
              prepend-icon="mdi-account"
              variant="elevated"
              class="bg-secondary"
            >
              {{ $t('admin.signed-users-number', [
                course.users.length,
              ]) }}
            </v-chip>
          </v-list-item-subtitle>

          <template #append>
            <v-btn
              variant="plain"
              link
              :to="`/admin/courses/${course.id}`"
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
const courseStore = useCourseStore()
const { user } = storeToRefs(userStore)
const { courses } = storeToRefs(courseStore)

watch(user, (newUser) => {
  if (!newUser)
    return
  courseStore.fetchCourses('all')
}, { immediate: true })
</script>
