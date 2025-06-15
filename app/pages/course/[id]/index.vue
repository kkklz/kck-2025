<template>
  <div class="mx-5 mt-12">
    <v-breadcrumbs
      :items="breadcrumbs"
    />

    <v-card
      class="mx-5"
    >
      <v-img
        :src="currentCourse?.photoUrl || '/default-course-image-large.webp'"
        height="250"
        cover
        class="align-end"
      >
        <v-card-title class="text-white">
          {{ currentCourse?.name }}
        </v-card-title>
      </v-img>

      <div class="p-4 gap-10 grid grid-cols-1 md:grid-cols-2">
        <v-card
          class="h-min"
          elevation="0"
          border
        >
          <v-card-title class="bg-primary">
            {{ $t('courses.quiz-list') }}
          </v-card-title>

          <v-list v-if="quizzes && quizzes.length > 0">
            <v-list-item
              v-for="(quiz, idx) in quizzes"
              :key="quiz.id"
              link
              :to="`/course/${currentCourse?.id}/quiz/${quiz.id}`"
            >
              <v-list-item-title><span class="text-gray-500">#{{ idx + 1 }}</span> {{ quiz.description }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-list v-else>
            <v-list-item>
              {{ $t('courses.quiz-list-empty') }}
            </v-list-item>
          </v-list>
        </v-card>

        <v-card
          class="h-min"
          elevation="0"
          border
        >
          <v-card-title class="bg-secondary">
            {{ $t('courses.ranking') }}
          </v-card-title>

          <v-list v-if="ranking.length > 0">
            <v-list-item
              v-for="place in ranking"
              :key="place.position"
            >
              <template #prepend>
                <span
                  class="text-gray-500 w-10"
                  :class="place.position === 1
                    ? 'text-secondary text-2xl'
                    : place.position === 2
                      ? 'text-secondary text-xl'
                      : place.position === 3
                        ? 'text-secondary text-lg'
                        : ''"
                >
                  #{{ place.position }}
                </span>

                <v-avatar>
                  <v-img :src="place.user.photoUrl || '/default-avatar.webp'" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ place.user.firstName }} {{ place.user.lastName }}
              </v-list-item-title>

              <v-list-item-subtitle v-if="place.user.studentIndex">
                {{ place.user.studentIndex }}
              </v-list-item-subtitle>

              <template #append>
                <v-chip
                  color="secondary"
                  class="!text-lg"
                  density="comfortable"
                >
                  {{ place.points }} {{ $t('courses.points-short') }}
                </v-chip>

                <v-btn
                  v-if="place.reward && place.reward.length > 0"
                  density="compact"
                  elevation="0"
                >
                  <v-icon icon="mdi-trophy" />

                  <v-tooltip activator="parent">
                    <div
                      v-for="reward in place.reward"
                      :key="reward"
                    >
                      <v-icon icon="mdi-circle-small" />
                      {{ reward }}
                    </div>
                  </v-tooltip>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-list v-else>
            <v-list-item>
              {{ $t('courses.ranking-empty') }}
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

const { currentCourse, ranking } = storeToRefs(courseStore)
const { quizzes } = storeToRefs(quizStore)

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
    await courseStore.fetchRanking(courseId),
  ])
})
</script>
