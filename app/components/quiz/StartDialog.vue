<template>
  <v-card
    elevation="2"
    class="mx-auto pa-6 !max-w-[600px]"
  >
    <div class="flex items-center justify-between">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        @click="goBack"
      />

      <span class="font-weight-bold text-h6">{{ $t('quiz.quiz') }}</span>

      <div style="width: 40px;" />
    </div>

    <v-divider class="my-4" />

    <v-alert
      v-if="quizError"
      type="error"
    >
      {{ $t('quiz.error-fetching-quiz') }}
    </v-alert>

    <div v-if="currentQuiz">
      <div class="mb-2">
        <span class="font-weight-bold">{{ $t('quiz.description') }}: </span>

        <span>{{ currentQuiz.description }}</span>
      </div>

      <div class="mb-2">
        <span class="font-weight-bold">{{ $t('quiz.time-limit') }}: </span>

        <span>{{ Math.floor(currentQuiz.timeLimit / 60) }}</span>
      </div>

      <div class="mb-2">
        <span class="font-weight-bold">{{ $t('quiz.max-attempts') }}: </span>

        <span>{{ currentQuiz.maxAttempts }}</span>
      </div>

      <div class="mb-2">
        <span class="font-weight-bold">{{ $t('quiz.question-count') }}: </span>

        <span>{{ currentQuiz.questions.length }}</span>
      </div>

      <div class="mb-4">
        <span class="font-weight-bold">{{ $t('quiz.your-attempts') }}: </span>

        <span>{{ userAttempts }} / {{ currentQuiz.maxAttempts }}</span>
      </div>

      <v-btn
        color="primary"
        :loading="loading"
        block
        size="large"
        @click="$emit('start')"
      >
        {{ $t('quiz.start-quiz') }}
      </v-btn>
    </div>

    <div
      v-else
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

function goBack() {
  router.back()
}
</script>
