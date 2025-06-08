import type { Database } from '~/types/database.types'
import type { QuizAttempt } from '~/types/quizAttempt'
import { nanoid } from 'nanoid'

export const useQuizAttemptStore = defineStore('quizAttempt', () => {
  const quizAttempt = ref<QuizAttempt | null>(null)
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  const quizStore = useQuizStore()
  const userStore = useUserStore()
  const { currentQuiz } = storeToRefs(quizStore)
  const { user } = storeToRefs(userStore)
  const supabase = useSupabaseClient<Database>()

  const QUIZ_ATTEMPT_TABLE = 'quiz_attempt'

  const getStartedQuizAttempt = async () => {
    if (!user.value?.id) {
      error.value = 'User not found'

      return
    }

    if (!currentQuiz.value) {
      error.value = 'No quiz selected'

      return
    }

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .select('*')
      .eq('quizId', currentQuiz.value.id)
      .eq('userId', user.value.id)
      .eq('status', 'started')
      .single()

    if (err) {
      error.value = err.message

      return
    }

    quizAttempt.value = dbQuizAttemptToQuizAttempt(data)
    loading.value = false
  }

  const startQuizAttempt = async () => {
    await getStartedQuizAttempt()

    if (quizAttempt.value) {
      return
    }

    if (!currentQuiz.value) {
      error.value = 'No quiz selected'

      return
    }

    if (!user.value?.id) {
      error.value = 'User not found'

      return
    }

    quizAttempt.value = {
      id: nanoid(),
      quizId: currentQuiz.value.id,
      userId: user.value.id,
      attemptDate: new Date(),
      finalScore: 0,
      questionsAnswered: 0,
      currentStreak: 0,
      status: 'started',
      dueDate: new Date(Date.now() + 1000 * 60 * currentQuiz.value.timeLimit),
      currentBonus: null,
    }

    const { error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .insert(quizAttemptToDbQuizAttempt(quizAttempt.value))

    if (err) {
      error.value = err.message
    }
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

    quizAttempt.value.status = 'submitted'

    const { error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .update(quizAttemptToDbQuizAttempt(quizAttempt.value))
      .eq('id', quizAttempt.value.id)

    if (err) {
      error.value = err.message
    }
  }

  const endQuizAttempt = async () => {
    if (!quizAttempt.value) {
      error.value = 'No quiz attempt found'

      return
    }
    if (quizAttempt.value.status === 'submitted') {
      return
    }
    quizAttempt.value.status = 'submitted'
    const { error: err } = await supabase
      .from(QUIZ_ATTEMPT_TABLE)
      .update(quizAttemptToDbQuizAttempt(quizAttempt.value))
      .eq('id', quizAttempt.value.id)
    if (err) {
      error.value = err.message
    }
  }

  const forceStartQuizAttempt = async () => {
    await endQuizAttempt()
    quizAttempt.value = null
    await startQuizAttempt()
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
  const answerQuestion = async (questionId: string, answerIds: string[]) => {
    if (!quizAttempt.value) {
      error.value = 'No quiz attempt found'

      return
    }

    if (quizAttempt.value.status !== 'started') {
      error.value = 'Quiz attempt not started'

      return
    }

    const question = currentQuiz.value?.questions.find(q => q.id === questionId)

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

      return
    }

    // --- Automatyczne zakończenie quizu po ostatnim pytaniu ---
    if (currentQuiz.value && quizAttempt.value.questionsAnswered >= currentQuiz.value.questions.length) {
      await submitQuizAttempt()
    }
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
  }

  return {
    quizAttempt,
    error,
    loading,
    getStartedQuizAttempt,
    startQuizAttempt,
    answerQuestion,
    submitQuizAttempt,
    endQuizAttempt,
    forceStartQuizAttempt,
    cancelQuizAttempt,
    currentQuestionIndex,
    currentQuestion,
    addTimeToQuizAttempt,
  }
})
