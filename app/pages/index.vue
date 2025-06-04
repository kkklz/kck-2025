<template>
  <div class="mx-5 mt-12">
    <v-alert v-if="error">
      {{ error.message }}
    </v-alert>

    <v-breadcrumbs
      :items="breadcrumbs"
    />

    <HomepageCoursesSkeleton v-if="loading" />

    <div class="px-5 gap-6 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
      <v-card
        v-for="course in courses"
        :key="course.id"
        link
        :to="`/course/${course.id}`"
        class="flex flex-col"
      >
        <v-img
          :src="course.photoUrl || '/default-course-image.webp'"
          height="200"
          cover
        />

        <p class="text-lg text-black p-4">
          {{ course.name }}
        </p>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="tsx">
definePageMeta({
  alias: ['/', '/courses'],
})

const { t } = useI18n()

const breadcrumbs = [{ title: t('courses.courses-view'), to: '/' }]

const courseStore = useCourseStore()

const { courses, loading, error } = storeToRefs(courseStore)

onBeforeMount(async () => {
  await courseStore.fetchCourses('all')
})
</script>
