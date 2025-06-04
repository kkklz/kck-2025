<template>
  <div class="mx-5 mt-12">
    <v-breadcrumbs
      :items="breadcrumbs"
    />

    <v-card class="mx-5">
      <v-img
        :src="currentCourse?.photoUrl || '/default-course-image.webp'"
        height="250"
        cover
        class="align-end"
      >
        <v-card-title class="text-white">
          {{ currentCourse?.name }}
        </v-card-title>
      </v-img>

      <div class="p-4 gap-10 grid grid-cols-1 md:grid-cols-2">
        <v-card>
          <v-card-title>{{ $t('courses.quiz-list') }}</v-card-title>

          <v-list>
            <v-list-item
              v-if="quizzesLoading"
            >
              <v-skeleton-loader type="list-item" />

              <v-skeleton-loader type="list-item" />

              <v-skeleton-loader type="list-item" />
            </v-list-item>

            <v-list-item
              v-for="(quiz, idx) in quizzes"
              :key="quiz.id"
              link
              :to="`/course/${currentCourse?.id}/quiz/${quiz.id}`"
            >
              <v-list-item-title><span class="text-gray-500">#{{ idx + 1 }}</span> {{ quiz.description }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const courseId = route.params.id as string

const courseStore = useCourseStore()
const quizStore = useQuizStore()

const { currentCourse } = storeToRefs(courseStore)
const { quizzes, loading: quizzesLoading } = storeToRefs(quizStore)

const breadcrumbs = ref<{ title: string, to?: string }[]>()
onBeforeMount(async () => {
  breadcrumbs.value = [
    { title: t('courses.courses-view'), to: '/' },
    { title: currentCourse.value?.name || 'Kurs', to: `/course/${courseId}` },
  ]

  quizStore.clearStore()

  Promise.all([
    await courseStore.fetchCourse(courseId),
    await quizStore.fetchQuizzes(courseId),
  ])
})
</script>
