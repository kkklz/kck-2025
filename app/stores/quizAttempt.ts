import type { Database } from '~/types/database.types'
import type { QuizAttempt } from '~/types/quizAttempt'
import { nanoid } from 'nanoid'

export const useQuizAttemptStore = defineStore('quizAttempt', () => {
  const quizAttempt = ref<QuizAttempt | null>(null)
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)
  const currentStage = ref<'start' | 'continue' | 'quiz' | 'no-attempts' | 'summary'>('start')
  const userAttempts = ref(0)

  const quizStore = useQuizStore()
  const userStore = useUserStore()
  const { currentQuiz } = storeToRefs(quizStore)
  const { user } = storeToRefs(userStore)
  const supabase = useSupabaseClient<Database>()

  const QUIZ_ATTEMPT_TABLE = 'quiz_attempt'

  const clearStore = () => {
    quizAttempt.value = null
    error.value = null
    loading.value = false
    currentStage.value = 'start'
    userAttempts.value = 0
  }

  const continueQuiz = () => {
    currentStage.value = 'quiz'
  }

  const startQuizAttempt = async () => {
    if (!currentQuiz.value) {
      error.value = 'No quiz selected'

      return
    }

    if (!user.value?.id) {
      error.value = 'User not found'

      return
    }

    loading.value = true
    error.value = null

    quizAttempt.value = {
      id: nanoid(),
      quizId: currentQuiz.value.id,
      userId: user.value.id,
      attemptDate: new Date(),
      finalScore: 0,
      questionsAnswered: 0,
      currentStreak: 0,
      status: 'started',
      dueDate: new Date(Date.now() + 1000 * currentQuiz.value.timeLimit),
      currentBonus: null,
    }

    const { data, error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .insert(quizAttemptToDbQuizAttempt(quizAttempt.value))
      .select()
      .single()

    if (data && quizAttempt.value) {
      quizAttempt.value.id = data.id
      currentStage.value = 'quiz'
    }

    if (err) {
      error.value = err.message
    }

    loading.value = false
  }

  const submitQuizAttempt = async () => {
    if (!quizAttempt.value) {
      error.value = 'No quiz attempt found'

      return
    }

    if (quizAttempt.value.status !== 'started') {
      error.value = 'Quiz attempt not started'

      return
    }

    loading.value = true
    error.value = null
    quizAttempt.value.status = 'submitted'

    const { error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .update(quizAttemptToDbQuizAttempt(quizAttempt.value))
      .eq('id', quizAttempt.value.id)

    if (err) {
      error.value = err.message
    }

    currentStage.value = 'summary'

    loading.value = false
  }

  // --- Pobierz liczbę zakończonych podejść użytkownika do quizu ---
  const getUserAttemptsCount = async (): Promise<number> => {
    if (!currentQuiz.value?.id || !user.value?.id) {
      return 0
    }
    const { data, error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .select('id')
      .eq('quizId', currentQuiz.value.id)
      .eq('userId', user.value.id)
      .eq('status', 'submitted')

    if (err) {
      error.value = err.message

      return 0
    }

    return data?.length || 0
  }

  const getStartedQuizAttempt = async () => {
    if (!user.value?.id) {
      error.value = 'User not found'

      return
    }

    if (!currentQuiz.value) {
      error.value = 'No quiz selected'

      return
    }

    clearStore()

    loading.value = true
    error.value = null

    userAttempts.value = await getUserAttemptsCount()

    if (userAttempts.value >= currentQuiz.value.maxAttempts) {
      quizAttempt.value = null
      currentStage.value = 'no-attempts'
      loading.value = false

      return
    }

    const { data, error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .select('*')
      .eq('quizId', currentQuiz.value.id)
      .eq('userId', user.value.id)
      .eq('status', 'started')
      .maybeSingle()

    if (err) {
      error.value = err.message

      return
    }

    if (data !== null) {
      quizAttempt.value = dbQuizAttemptToQuizAttempt(data)
      if (new Date(quizAttempt.value.dueDate).getTime() > Date.now()) {
        currentStage.value = 'continue'
      }
      else {
        await submitQuizAttempt()
        clearStore()
        currentStage.value = 'start'
      }
    }
    else {
      quizAttempt.value = null
      currentStage.value = 'start'
    }

    loading.value = false
  }

  // --- Aktualny indeks i pytanie ---
  const currentQuestionIndex = computed(() => {
    return quizAttempt.value
      ? quizAttempt.value.questionsAnswered
      : 0
  })
  const currentQuestion = computed(() => {
    if (!currentQuiz.value) {
      return null
    }

    return currentQuiz.value.questions[currentQuestionIndex.value] || null
  })

  // --- Odpowiedź na pytanie ---
  const answerQuestion = async (answerIds: string[]) => {
    if (!quizAttempt.value) {
      error.value = 'No quiz attempt found'

      return
    }

    if (quizAttempt.value.status !== 'started') {
      error.value = 'Quiz attempt not started'

      return
    }

    loading.value = true
    error.value = null

    const question = currentQuiz.value?.questions.find(q => q.id === currentQuestion.value?.id)

    if (!question) {
      error.value = 'Question not found'

      return
    }

    const correctAnswers = question.answers.filter(a => a.correct)
    const selectedAnswers = question.answers.filter(a => answerIds.includes(a.id))
    const numCorrectSelected = selectedAnswers.filter(a => correctAnswers.includes(a)).length
    const numIncorrectSelected = selectedAnswers.filter(a => !correctAnswers.includes(a)).length
    const totalCorrect = correctAnswers.length
    const totalPoints = question.points

    let points = 0
    const isPerfect = numCorrectSelected === totalCorrect && numIncorrectSelected === 0
    if (isPerfect) {
      points = totalPoints
    }
    else {
      points = (numCorrectSelected / (totalCorrect + numIncorrectSelected)) * totalPoints
    }

    quizAttempt.value.finalScore += points
    quizAttempt.value.questionsAnswered++

    // --- OBSŁUGA STREAKA I BONUSU ---
    if (isPerfect) {
      quizAttempt.value.currentStreak++
      if (quizAttempt.value.currentStreak >= 3) {
        const bonuses: ('minigame_shooter' | 'minigame_memory' | '50_50' | 'bonus_time')[] = [
          'minigame_shooter',
          'minigame_memory',
          '50_50',
          'bonus_time',
        ]
        const randomBonus = bonuses[Math.floor(Math.random() * bonuses.length)] ?? null
        quizAttempt.value.currentBonus = randomBonus
        quizAttempt.value.currentStreak = 0
      }
    }
    else {
      quizAttempt.value.currentStreak = 0
    }

    const { error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .update(quizAttemptToDbQuizAttempt(quizAttempt.value))
      .eq('id', quizAttempt.value.id)

    if (err) {
      error.value = err.message
      loading.value = false

      return
    }

    // --- Automatyczne zakończenie quizu po ostatnim pytaniu ---
    if (currentQuiz.value && quizAttempt.value.questionsAnswered >= currentQuiz.value.questions.length) {
      await submitQuizAttempt()
    }

    loading.value = false
  }

  // --- Wcześniejsze zakończenie quizu przez użytkownika ---
  const cancelQuizAttempt = async () => {
    await submitQuizAttempt()
  }

  // --- Wydłużenie czasu na quiz ---
  const addTimeToQuizAttempt = async (extraSeconds: number) => {
    if (!quizAttempt.value) {
      error.value = 'No quiz attempt found'

      return
    }

    loading.value = true
    error.value = null

    // Dodaj czas do dueDate
    const newDueDate = new Date(quizAttempt.value.dueDate.getTime() + extraSeconds * 1000)
    quizAttempt.value.dueDate = newDueDate

    const { error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .update(quizAttemptToDbQuizAttempt(quizAttempt.value))
      .eq('id', quizAttempt.value.id)

    if (err) {
      error.value = err.message
    }

    loading.value = false
  }

  const incrementQuestionIndex = () => {
    quizAttempt.value!.questionsAnswered++
  }

  const startNewQuizAttempt = async () => {
    await submitQuizAttempt()
  }

  return {
    quizAttempt,
    error,
    loading,
    userAttempts,
    currentStage,
    getStartedQuizAttempt,
    startQuizAttempt,
    answerQuestion,
    submitQuizAttempt,
    cancelQuizAttempt,
    currentQuestionIndex,
    currentQuestion,
    addTimeToQuizAttempt,
    getUserAttemptsCount,
    incrementQuestionIndex,
    continueQuiz,
    startNewQuizAttempt,
    clearStore,
  }
})
