<template>
  <v-card
    elevation="2"
    class="mx-auto pa-8 !max-w-[600px]"
  >
    <!-- Nagłówek quizu i numeracja -->
    <div class="mb-2 grid grid-cols-3 items-end">
      <slot name="quiz-title" />

      <div class="flex flex-col gap-2 items-center justify-center">
        <span class="text-center">{{ questionIndexLabel }}</span>

        <span><v-icon
          icon="mdi-fire"
          color="#fa6705"
        />{{ quizAttempt?.currentStreak }}</span>
      </div>

      <span class="text-end">{{ formattedTime }}</span>
    </div>

    <v-divider class="mb-4" />

    <!-- Treść pytania -->
    <div class="mb-2 text-center">
      {{ question?.content }}
    </div>

    <div class="text-grey text-body-2 mb-4 text-center">
      {{ isSingleCorrect
        ? 'Wybierz jedną poprawną odpowiedź.'
        : 'Wybierz wszystkie poprawne odpowiedzi.' }}
    </div>

    <div>
      {{ model }}
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
        />
      </v-radio-group>

      <div v-else>
        <v-checkbox
          v-for="answer in question.answers"
          :key="answer.id"
          v-model="model"
          hide-details
          :label="answer.answer"
          :value="answer.id"
        />
      </div>
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
const model = defineModel<string[]>()

const quizAttemptStore = useQuizAttemptStore()
const { quizAttempt } = storeToRefs(quizAttemptStore)

const timeLeft = ref(0)
const intervalId = ref<NodeJS.Timeout | null>(null)

const isSingleCorrect = computed(() => {
  if (!props.question)
    return true

  return props.question.answers.filter(a => a.correct).length === 1
})

const formattedTime = computed(() => formatDate(timeLeft.value))

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
