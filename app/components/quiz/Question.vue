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

    <!-- Odpowiedzi -->
    <div v-if="question">
      <div
        v-for="answer in filteredAnswers"
        :key="answer.id"
        class="mb-4 flex flex-row gap-3"
      >
        <div
          :class="`px-3 py-2 rounded-md w-full cursor-pointer transition-all duration-300 text-wrap ${model?.includes(answer.id)
            ? 'ring-blue-500 ring-2'
            : 'ring-gray-300 ring'}`"
          @click="handleSelectAnswer(answer.id)"
        >
          {{ answer.answer }}
        </div>
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
const { quizAttempt, filteredAnswers } = storeToRefs(quizAttemptStore)

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

function handleSelectAnswer(answerId: string) {
  if (model.value) {
    if (isSingleCorrect.value) {
      model.value = [answerId]
    }
    else {
      if (model.value.includes(answerId)) {
        model.value = model.value.filter(a => a !== answerId)
      }
      else {
        model.value.push(answerId)
      }
    }
  }
  else {
    model.value = [answerId]
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
