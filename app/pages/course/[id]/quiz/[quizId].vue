<template>
  <v-container
    class="! py-8"
  >
    <v-alert
      v-if="quizError"
      type="error"
    >
      {{ quizError.message }}
    </v-alert>

    <QuizContinue
      v-if="currentStage === 'continue'"
      @yes="handleContinueQuiz"
      @no="startNewQuiz"
    />

    <QuizStartDialog
      v-else-if="currentStage === 'start'"
      :loading="loading"
      :user-attempts="userAttempts"
      :current-quiz="currentQuiz"
      :quiz-error="quizError"
      @start="startQuiz"
    />

    <v-card
      v-else-if="currentStage === 'no-attempts'"
      elevation="2"
      class="mx-auto pa-6 !max-w-[600px]"
    >
      <v-card-title>
        {{ $t('quiz.max-attempts-exceeded') }}
      </v-card-title>

      <v-btn
        class="w-full block"
        variant="plain"
        @click="goBack"
      >
        {{ $t('universal.back') }}
      </v-btn>
    </v-card>

    <div v-else-if="currentStage === 'summary'">
      <QuizSummary
        :quiz-attempt="quizAttempt"
        :quiz="currentQuiz"
        :course-id="courseId"
      />
    </div>

    <div
      v-else
      :class="{'slideIn': animateRef}"
    >
      <QuizQuestion
        v-model="selectedAnswers"
        :question="currentQuestion"
      >
        <template #quiz-title>
          <span>{{ currentQuiz?.description }}</span>
        </template>

        <template #end>
          <v-btn
            v-if="currentIndex < totalQuestions - 1"
            @click="endQuizAttempt"
          >
            {{ $t('quiz.end-quiz') }}
          </v-btn>
        </template>

        <template #confirm>
          <v-btn
            color="primary"
            @click="handleSubmitQuestion"
          >
            {{ currentIndex < totalQuestions - 1
              ? $t('quiz.next-question')
              : $t('quiz.end-quiz') }}
          </v-btn>
        </template>
      </QuizQuestion>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
const quizStore = useQuizStore()
const quizAttemptStore = useQuizAttemptStore()
const { currentQuiz, error: quizError } = storeToRefs(quizStore)
const { currentQuestion, currentStage, loading, userAttempts, quizAttempt } = storeToRefs(quizAttemptStore)
const router = useRouter()

const selectedAnswers = ref<string[]>([''])
const animateRef = ref(false)

const courseId = route.params.id as string
const quizId = route.params.quizId as string

const currentIndex = computed(() => quizAttemptStore.currentQuestionIndex)
const totalQuestions = computed(() => currentQuiz.value?.questions.length || 0)

onMounted(async () => {
  await quizStore.fetchQuiz(quizId)
  await quizAttemptStore.getStartedQuizAttempt()
})

onUnmounted(() => {
  quizAttemptStore.clearStore()
})

watch(currentStage, async (newStage) => {
  if (newStage === 'start') {
    await quizAttemptStore.getStartedQuizAttempt()
  }
})

function handleContinueQuiz() {
  quizAttemptStore.continueQuiz()
}

async function startNewQuiz() {
  await quizAttemptStore.startNewQuizAttempt()
}

async function startQuiz() {
  await quizAttemptStore.startQuizAttempt()
}

function goBack() {
  router.back()
}

async function endQuizAttempt() {
  await quizAttemptStore.submitQuizAttempt()
  router.push(`/course/${courseId}`)
}

async function handleSubmitQuestion() {
  animate()
  await quizAttemptStore.answerQuestion(selectedAnswers.value)
}

function animate() {
  animateRef.value = true
  setTimeout(() => {
    animateRef.value = false
  }, 500)
}
</script>

<style scoped>
.slideIn {
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
