<template>
  <v-card
    v-if="quizAttempt !== null && quiz !== null"
    elevation="2"
    class="mx-auto pa-8 !max-w-[600px]"
  >
    <v-card-title>
      {{ $t('quiz.summary') }}
    </v-card-title>

    <v-card-subtitle class="py-2">
      {{ quiz?.description }}
    </v-card-subtitle>

    <v-divider />

    <v-card-text>{{ $t('quiz.achievied-points') }}: {{ quizAttempt?.finalScore }}</v-card-text>

    <v-card-text>{{ $t('quiz.questions-count') }}: {{ quizAttempt?.questionsAnswered }}</v-card-text>

    <v-card-text>{{ $t('quiz.attempt-time') }}: {{ formatDate(Math.floor((Date.now() - quizAttempt.attemptDate.getTime()) / 1000)) }}</v-card-text>

    <v-divider />

    <v-btn
      block
      :to="`/course/${courseId}`"
      variant="plain"
      class="pt-2"
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
