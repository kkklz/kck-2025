<template>
  <v-card
    v-if="quizAttempt !== null && quiz !== null"
    elevation="2"
    class="mx-auto pa-6 !max-w-[600px]"
  >
    <v-card-title class="py-4 text-center border-rounded bg-primary !flex !items-center !justify-between">
      <v-icon icon="mdi-check" />

      <span class="font-weight-bold text-h6">{{ $t('quiz.summary') }}</span>

      <div style="width: 40px;" />
    </v-card-title>

    <v-card-text class="py-4 !text-lg">
      <v-icon
        color="primary"
        icon="mdi-text"
      />

      <span class="font-semibold ml-2">{{ $t('quiz.quiz-description') }}</span>

      <div>
        {{ quiz?.description }}
      </div>
    </v-card-text>

    <v-divider />

    <v-card-text class="flex flex-col gap-4 !text-base">
      <div>
        <v-icon
          color="secondary"
          icon="mdi-star-four-points-circle-outline"
          class="mr-2"
        />

        {{ $t('quiz.achievied-points') }}: <v-chip
          variant="tonal"
          color="primary"
        >
          {{ quizAttempt?.finalScore }}
        </v-chip>
      </div>

      <div>
        <v-icon
          color="secondary"
          icon="mdi-text-box-check-outline"
          class="mr-2"
        />

        {{ $t('quiz.questions-count') }}: <v-chip
          variant="tonal"
          color="primary"
        >
          {{ quizAttempt?.questionsAnswered }}
        </v-chip>
      </div>

      <div>
        <v-icon
          color="secondary"
          icon="mdi-clock-time-eight-outline"
          class="mr-2"
        />

        {{ $t('quiz.attempt-time') }}: <v-chip
          variant="tonal"
          color="primary"
        >
          {{ formatDate(Math.floor((Date.now() - quizAttempt.attemptDate.getTime()) / 1000)) }}
        </v-chip>
      </div>
    </v-card-text>

    <v-btn
      block
      :to="`/course/${courseId}`"
      variant="plain"
      class="mt-2"
    >
      {{ $t('quiz.back-to-course') }}
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import type { Quiz } from '~/types/quiz'
import type { QuizAttempt } from '~/types/quizAttempt'

// Ilość zdobytych punktów
// Ilość pytań z bezbłędnymi odpowiedziami / ilość pytań
// Długość podejścia
// Nowe miejsce w rankingu

const { quizAttempt, quiz, courseId } = defineProps<{ quizAttempt: QuizAttempt | null, quiz: Quiz | null, courseId: string }>()
</script>
