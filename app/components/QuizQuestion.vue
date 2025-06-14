<template>
  <v-card
    elevation="2"
    class="mx-auto pa-8 !max-w-[600px]"
  >
    <!-- Nagłówek quizu i numeracja -->
    <div class="mb-2 flex items-center justify-between">
      <slot name="quiz-title" />

      <span class="text-grey text-caption">{{ questionIndexLabel }}</span>

      <span>{{ formattedTime }}</span>
    </div>

    <v-divider class="mb-4" />

    <!-- Treść pytania -->
    <div class="font-weight-bold text-h6 mb-2 text-center">
      {{ question?.content }}
    </div>

    <div class="text-grey text-body-2 mb-4 text-center">
      {{ isSingleCorrect
        ? 'Wybierz jedną poprawną odpowiedź.'
        : 'Wybierz wszystkie poprawne odpowiedzi.' }}
    </div>

    <!-- Odpowiedzi -->
    <div v-if="question">
      <v-radio-group
        v-if="isSingleCorrect"
        v-model="model"
        class="mb-4"
        hide-details
      >
        <v-radio
          v-for="answer in question.answers"
          :key="answer.id"
          :label="answer.answer"
          :value="answer.id"
          class="answer-radio"
        />
      </v-radio-group>

      <v-checkbox
        v-for="answer in question.answers"
        v-else
        :key="answer.id"
        v-model="model"
        :label="answer.answer"
        :value="answer.id"
        class="answer-checkbox"
      />
    </div>

    <!-- Przyciski -->
    <div class="mt-6 flex gap-2 justify-between">
      <slot name="end" />

      <slot name="confirm" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Question } from '~/types/question'
import { computed } from 'vue'

const props = defineProps<{ question: Question | null, questionIndexLabel?: string }>()
const model = defineModel<string[] | string>()

const quizAttemptStore = useQuizAttemptStore()
const { quizAttempt } = storeToRefs(quizAttemptStore)

const timeLeft = ref(0)
const intervalId = ref<NodeJS.Timeout | null>(null)

const isSingleCorrect = computed(() => {
  if (!props.question)
    return true

  return props.question.answers.filter(a => a.correct).length === 1
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

function updateTimer() {
  if (!quizAttempt.value) {
    return
  }

  const now = new Date().getTime()
  const due = quizAttempt.value.dueDate.getTime()
  const difference = Math.floor((due - now) / 1000)
  if (difference <= 0) {
    (async function () {
      await quizAttemptStore.submitQuizAttempt()
      if (intervalId.value)
        clearInterval(intervalId.value)
    })()
  }
  else {
    timeLeft.value = difference
  }
}

onMounted(() => {
  updateTimer()
  intervalId.value = setInterval(updateTimer, 1000)
})

onBeforeUnmount(() => {
  if (intervalId.value)
    clearInterval(intervalId.value)
})
</script>

<style scoped>
.answer-radio .v-selection-control__input,
.answer-checkbox .v-selection-control__input {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  background: #fafbfc;
  transition: border-color 0.2s, background 0.2s;
}
.answer-radio.v-selection-control--dirty .v-selection-control__input,
.answer-checkbox.v-selection-control--dirty .v-selection-control__input {
  border-color: #1976d2;
  background: #e3f0fd;
}
</style>
