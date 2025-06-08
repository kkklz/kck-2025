<template>
  <v-container
    class="! py-8"
  >
    <QuizStartDialog
      v-if="!quizStarted"
      :loading="loading"
      :user-attempts="userAttempts"
      :current-quiz="currentQuiz"
      :quiz-error="quizError"
      :breadcrumbs="breadcrumbs"
      @start="startQuiz"
    />

    <div v-else>
      <div class="text-grey mb-2 text-right">
        {{ $t('quiz.time-left') }}: {{ Math.floor(timeLeft / 60) }}:{{ (timeLeft % 60).toString().padStart(2, '0') }}
      </div>

      <QuizQuestion
        v-model="selectedAnswers"
        :question="currentQuestion"
        :question-index-label="`Pytanie ${currentIndex + 1} z ${totalQuestions}`"
      >
        <template #quiz-title>
          <span class="font-weight-bold">{{ currentQuiz?.description }}</span>
        </template>

        <template #end>
          <v-btn
            color="grey"
            variant="outlined"
            @click="finishQuiz"
          >
            {{ $t('quiz.end-quiz') }}
          </v-btn>
        </template>

        <template #confirm>
          <v-btn
            color="primary"
            @click="nextQuestion"
          >
            {{ currentIndex === totalQuestions - 1
              ? 'Zakończ'
              : 'Następne' }}
          </v-btn>
        </template>
      </QuizQuestion>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const route = useRoute()
const quizStore = useQuizStore()
const quizAttemptStore = useQuizAttemptStore()
const courseStore = useCourseStore()
const { currentCourse } = storeToRefs(courseStore)
const { currentQuiz, error: quizError } = storeToRefs(quizStore)
const { currentQuestion } = storeToRefs(quizAttemptStore)
const { t } = useI18n()

const loading = ref(false)
const breadcrumbs = ref<{ title: string, to?: string }[]>([])
const userAttempts = ref(0)
const quizStarted = ref(false)
const selectedAnswers = ref<string[]>([''])

const courseId = route.params.id as string
const quizId = route.params.quizId as string

const currentIndex = computed(() => quizAttemptStore.currentQuestionIndex)
const totalQuestions = computed(() => currentQuiz.value?.questions.length || 0)
// const isSingleCorrect = computed(() => {
//   if (!currentQuestion.value) return true
//   return currentQuestion.value.answers.filter(a => a.correct).length === 1
// })

const timeLeft = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

async function startQuiz() {
  loading.value = true
  await quizAttemptStore.startQuizAttempt()
  loading.value = false
  quizStarted.value = true
  startTimer()
}

async function nextQuestion() {
  await quizAttemptStore.answerQuestion(currentQuestion.value!.id, selectedAnswers.value)
  // eslint-disable-next-line require-atomic-updates
  selectedAnswers.value = ['']
  if (currentIndex.value < totalQuestions.value - 1) {
    quizAttemptStore.incrementQuestionIndex() // lub obsłuż przez questionsAnswered
  }
  else {
    finishQuiz()
  }
}

async function finishQuiz() {
  await quizAttemptStore.submitQuizAttempt()
  // Przekieruj do podsumowania lub wyświetl wynik
  navigateTo(`/course/${courseId}`)
}

function startTimer() {
  if (!quizAttemptStore.quizAttempt || !quizAttemptStore.quizAttempt.dueDate)
    return
  const due = new Date(quizAttemptStore.quizAttempt.dueDate).getTime()
  timer = setInterval(() => {
    const now = Date.now()
    timeLeft.value = Math.max(0, Math.floor((due - now) / 1000))
    if (timeLeft.value === 0 && timer) {
      clearInterval(timer)
      finishQuiz()
    }
  }, 1000)
}

onMounted(async () => {
  breadcrumbs.value = [
    { title: t('courses.courses-view'), to: '/' },
    { title: currentCourse.value?.name || 'Kurs', to: `/course/${courseId}` },
    { title: currentQuiz.value?.description || 'Quiz', to: `/course/${courseId}/quiz/${quizId}` },
  ]
  loading.value = true
  await quizStore.fetchQuiz(quizId)
  userAttempts.value = await quizAttemptStore.getUserAttemptsCount()
  loading.value = false
  // startTimer() // jeśli quiz startuje od razu
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>
