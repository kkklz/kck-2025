<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card
      v-if="currentCourse"
      class="py-2"
    >
      <v-breadcrumbs
        :items="breadcrumbs"
      />

      <v-card-title class="!text-4xl">
        {{ $t('universal.settings') }}
      </v-card-title>

      <v-card-subtitle>
        {{ currentCourse.name }}
      </v-card-subtitle>
    </v-card>

    <v-card class="pa-4">
      <AdminCourseForm
        v-if="currentCourse"
        :id="currentCourse.id"
        mode="edit"
        :name="currentCourse.name"
        :description="currentCourse.description"
        :users="currentCourse.users"
        :prizes="currentCourse.prizes"
        :photo-url="currentCourse.photoUrl"
      />
    </v-card>

    <v-card :title="$t('quiz.quizzes')">
      <v-card-text>
        <v-btn
          color="primary"
          link
          :to="`/admin/courses/${courseId}/new-quiz`"
        >
          {{ $t('quiz.add-quiz') }}
        </v-btn>
      </v-card-text>

      <v-card-text>
        <v-list v-if="currentCourse?.quizzes.length !== 0">
          <v-list-item
            v-for="(quiz, index) in currentCourse?.quizzes"
            :key="quiz.id"
            prepend-icon="mdi-file-document"
            link
          >
            <v-list-item-title>
              {{ $t('quiz.quizz-title', [
                index + 1,
              ]) }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ quiz.description }}
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                link
                :to="`/admin/courses/${courseId}/quiz/${quiz.id}`"
                variant="plain"
              >
                {{ $t('universal.settings') }}
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-card-subtitle
          v-else
        >
          {{ $t('quiz.no-quizzes-available') }}
        </v-card-subtitle>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()

const userStore = useUserStore()
const courseStore = useCourseStore()
const { user } = storeToRefs(userStore)
const { currentCourse } = storeToRefs(courseStore)

const courseId = useRoute().params.id as string

const breadcrumbs = ref<{ title: string, to?: string }[]>([
  {
    title: t('admin.course-management'),
    to: '/admin/courses',
  },
])

watch(user, async (newUser) => {
  if (!newUser)
    return

  await courseStore.fetchCourse(courseId)
  if (!currentCourse.value)
    return

  breadcrumbs.value.push({
    title: currentCourse.value.name,
  })
}, { immediate: true })
</script>
