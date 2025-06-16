<template>
  <v-card
    elevation="2"
    class="mx-auto pa-6 !max-w-[600px]"
  >
    <v-card-title class="border-rounded bg-primary !flex !items-center !justify-between">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        @click="goBack"
      />

      <span class="font-weight-bold text-h6">{{ $t('quiz.quiz') }}</span>

      <div style="width: 40px;" />
    </v-card-title>

    <v-alert
      v-if="quizError"
      type="error"
    >
      {{ $t('quiz.error-fetching-quiz') }}
    </v-alert>

    <div
      v-if="currentQuiz"
      class="text-lg my-4"
    >
      <v-card
        v-for="(info, index) in quizInfo"
        :key="index"
        :title="info.title"
        elevation="0"
      >
        <template #prepend>
          <v-icon
            color="primary"
          >
            {{ info.icon }}
          </v-icon>
        </template>

        <v-card-text class="text-gray-600 ml-9 !text-base">
          {{ info.content }}
        </v-card-text>

        <v-divider v-if="index < quizInfo.length - 1" />
      </v-card>
    </div>

    <v-card-actions class="justify-center">
      <v-btn
        color="secondary"
        :loading="loading"
        size="large"
        variant="flat"
        block
        @click="$emit('start')"
      >
        {{ $t('quiz.start-quiz') }}
      </v-btn>
    </v-card-actions>

    <div
      v-if="!currentQuiz"
      class="py-8 text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { PostgrestError } from '@supabase/supabase-js'
import type { Quiz } from '~/types/quiz'

const { loading, userAttempts, currentQuiz, quizError } = defineProps<{
  loading: boolean
  userAttempts: number
  currentQuiz: Quiz | null
  quizError: PostgrestError | null
}>()

defineEmits<{ start: [] }>()

const router = useRouter()

const { t } = useI18n()

const quizInfo = ref<any>([])

watch([() => currentQuiz, () => userAttempts], () => {
  quizInfo.value = [{
    title: t('quiz.description'),
    icon: 'mdi-text',
    content: currentQuiz?.description,
  }, {
    title: t('quiz.time-limit'),
    icon: 'mdi-clock-time-eight',
    content: Math.floor(currentQuiz?.timeLimit
      ? currentQuiz.timeLimit / 60
      : 0),
  }, {
    title: t('quiz.max-attempts'),
    icon: 'mdi-restore',
    content: currentQuiz?.maxAttempts,
  }, {
    title: t('quiz.question-count'),
    icon: 'mdi-help',
    content: currentQuiz?.questions.length,
  }, {
    title: t('quiz.your-attempts'),
    icon: 'mdi-account-reactivate',
    content: `${userAttempts} / ${currentQuiz?.maxAttempts}`,
  }, {
    title: t('quiz.your-highscore'),
    icon: 'mdi-medal',
    content: `${currentQuiz?.highScore ?? 'Brak'} ${currentQuiz?.highScore
      ? t('courses.points-short')
      : ''}`,
  }]
}, { immediate: true })

function goBack() {
  router.back()
}
</script>
