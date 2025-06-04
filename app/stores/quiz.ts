import type { QueryError } from '@supabase/supabase-js'
import type { Answer } from '@/types/answer'
import type { Database } from '@/types/database.types'
import type { Question } from '@/types/question'
import type { Quiz } from '@/types/quiz'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes: Ref<Quiz[] | null> = ref(null)
  const currentQuiz: Ref<Quiz | null> = ref(null)
  const error: Ref<QueryError | null> = ref(null)
  const loading: Ref<boolean> = ref(false)

  const supabase = useSupabaseClient<Database>()

  const QUIZ_TABLE = 'quiz'
  const QUESTION_TABLE = 'question'
  const ANSWER_TABLE = 'answer'

  // --- Answer ---
  async function addAnswer(answer: Answer, questionId: string): Promise<DBAnswer> {
    const { data: answerData, error: answerError } = await supabase.from(ANSWER_TABLE).insert(answerToDbAnswer(answer, questionId)).select().single()
    if (answerError)
      throw answerError

    return answerData
  }

  async function fetchAnswers(questionId: string): Promise<DBAnswer[]> {
    const { data: answerData, error: answerError } = await supabase.from(ANSWER_TABLE).select('*').eq('questionId', questionId)
    if (answerError)
      throw answerError

    return answerData
  }

  async function updateAnswer(answer: Answer, questionId: string): Promise<DBAnswer> {
    const { data: answerData, error: answerError } = await supabase.from(ANSWER_TABLE).update(answerToDbAnswer(answer, questionId)).eq('id', answer.id).select().single()
    if (answerError)
      throw answerError

    return answerData
  }

  async function deleteAnswer(answerId: string): Promise<void> {
    const { error: answerError } = await supabase.from(ANSWER_TABLE).delete().eq('id', answerId)
    if (answerError)
      throw answerError
  }

  // --- Question ---
  async function addQuestion(question: Question, quizId: string): Promise<DBQuestion> {
    const { data: questionData, error: questionError } = await supabase.from(QUESTION_TABLE).insert(questionToDbQuestion(question, quizId)).select().single()
    if (questionError)
      throw questionError

    return questionData
  }

  async function fetchQuestions(quizId: string): Promise<DBQuestion[]> {
    const { data: questionData, error: questionError } = await supabase.from(QUESTION_TABLE).select('*').eq('quizId', quizId)
    if (questionError)
      throw questionError

    return questionData
  }

  async function updateQuestion(question: Question, quizId: string): Promise<DBQuestion> {
    const { data: questionData, error: questionError } = await supabase.from(QUESTION_TABLE).update(questionToDbQuestion(question, quizId)).eq('id', question.id).select().single()
    if (questionError)
      throw questionError

    return questionData
  }

  async function deleteQuestion(questionId: string): Promise<void> {
    const { error: questionError } = await supabase.from(QUESTION_TABLE).delete().eq('id', questionId)
    if (questionError)
      throw questionError
  }

  // --- Quiz ---
  async function addQuiz(q: Omit<Quiz, 'courseId'>, courseId: string): Promise<DBQuiz> {
    const { data: quizData, error: quizError } = await supabase.from(QUIZ_TABLE).insert(quizToDbQuiz(q, courseId)).select().single()
    if (quizError)
      throw quizError

    quizzes.value = [...(quizzes.value || []), dbQuizToQuiz(quizData, [])]
    currentQuiz.value = dbQuizToQuiz(quizData, [])

    return quizData
  }

  async function fetchQuizzes(courseId: string) {
    const { data: quizData, error: quizError } = await supabase.from(QUIZ_TABLE).select('*').eq('courseId', courseId)
    if (quizError) {
      error.value = quizError

      return
    }

    quizzes.value = quizData.map(q => dbQuizToQuiz(q, []))
  }

  async function fetchQuiz(quizId: string) {
    loading.value = true
    error.value = null
    try {
      // Pobierz quiz z powiązaniami w jednym zapytaniu
      const { data: quizData, error: quizError } = await supabase
        .from(QUIZ_TABLE)
        .select(`
          *,
          question(
            *,
            answer(*)
          )
        `)
        .eq('id', quizId)
        .single()
      if (quizError || !quizData)
        throw quizError
      // Mapowanie do typu Quiz
      const questions = (quizData.question || []).map((q) => {
        const answers = (q.answer || []).map(a => dbAnswerToAnswer(a))

        return dbQuestionToQuestion(q, answers)
      })
      const quiz = dbQuizToQuiz(quizData, questions)

      currentQuiz.value = quiz
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  async function updateQuiz(quizId: string, updatedQuiz: Quiz) {
    loading.value = true
    error.value = null
    try {
      // Aktualizuj quiz
      const { description, timeLimit, maxAttempts, questions: newQuestions } = updatedQuiz
      const { error: quizError } = await supabase.from(QUIZ_TABLE).update({
        description,
        timeLimit,
        maxAttempts,
      }).eq('id', quizId)
      if (quizError)
        throw quizError

      // Pobierz aktualny quiz z bazy (z pytaniami i odpowiedziami)
      await fetchQuiz(quizId)
      const oldQuestions = currentQuiz.value?.questions || []

      // --- USUWANIE PYTAŃ ---
      await Promise.all(oldQuestions.map(async (oldQ) => {
        await deleteQuestion(oldQ.id)
      }))

      // --- DODAWANIE/EDYCJA PYTAŃ I ODPOWIEDZI ---
      await Promise.all(newQuestions.map(async (newQ) => {
        // Dodaj nowe pytanie i odpowiedzi
        await addQuestion(newQ, quizId)
        await Promise.all(newQ.answers.map(async (newA) => {
          await addAnswer(newA, newQ.id)
        }))
      }))

      await fetchQuiz(quizId)
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteQuiz(quizId: string) {
    loading.value = true
    error.value = null
    try {
      // Usuń powiązania quiz_question
      // Usuń quiz
      const { error: quizError } = await supabase.from(QUIZ_TABLE).delete().eq('id', quizId)
      if (quizError)
        throw quizError
      currentQuiz.value = null
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  function clearStore() {
    quizzes.value = null
    currentQuiz.value = null
    error.value = null
    loading.value = false
  }

  return {
    quizzes,
    currentQuiz,
    error,
    loading,
    addAnswer,
    fetchAnswers,
    updateAnswer,
    deleteAnswer,
    addQuestion,
    fetchQuestions,
    updateQuestion,
    deleteQuestion,
    addQuiz,
    fetchQuizzes,
    fetchQuiz,
    updateQuiz,
    deleteQuiz,
    clearStore,
  }
})
