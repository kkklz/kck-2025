// import type { QueryError } from '@supabase/supabase-js'
// import type { Quiz } from '@/types/quiz'
// import type { Database } from '~/types/database.types'
// import {
//   answerToDbAnswer,
//   dbAnswerToAnswer,
//   dbPrizeToPrize,
//   dbQuestionToQuestion,
//   dbQuizToQuiz,
//   prizeToDbPrize,
//   questionToDbQuestion,
// } from '@/utils/convertTypes'

// export const useQuizStore = defineStore('quiz', () => {
//   const quiz: Ref<Quiz | null> = ref(null)
//   const error: Ref<QueryError | null> = ref(null)
//   const loading: Ref<boolean> = ref(false)

//   const supabase = useSupabaseClient<Database>()

//   const QUIZ_TABLE = 'quiz'

//   async function addQuiz(newQuiz: Quiz) {
//     loading.value = true
//     error.value = null
//     try {
//       // Dodaj quiz (bez pytań i nagród)
//       const { prizes, questions } = newQuiz
//       // Najpierw dodaj nagrodę (jeśli nie istnieje)
//       let prizeId: string
//       if (prizes.length > 0) {
//         const mainPrize = prizes[0]
//         if (!mainPrize)
//           throw new Error('Quiz musi mieć przynajmniej jedną nagrodę')
//         const placeFrom = Array.isArray(mainPrize.place)
//           ? mainPrize.place[0]
//           : mainPrize.place
//         const placeTo = Array.isArray(mainPrize.place)
//           ? mainPrize.place[1]
//           : mainPrize.place
//         const { data: existingPrize, error: findPrizeError } = await supabase.from('prize').select('id').eq('placeFrom', placeFrom).eq('placeTo', placeTo).eq('reward', mainPrize.reward).maybeSingle()
//         if (findPrizeError)
//           throw findPrizeError
//         if (existingPrize) {
//           prizeId = existingPrize.id
//         }
//         else {
//           const { data: prizeData, error: prizeError } = await supabase.from('prize').insert(prizeToDbPrize(mainPrize)).select().single()
//           if (prizeError || !prizeData)
//             throw prizeError
//           prizeId = prizeData.id
//         }
//       }
//       else {
//         throw new Error('Quiz musi mieć przynajmniej jedną nagrodę')
//       }
//       // Dodaj quiz
//       const quizInsert = {
//         description: newQuiz.description,
//         timeLimit: newQuiz.timeLimit,
//         maxAttempts: newQuiz.maxAttempts,
//         prizeId,
//       }
//       const { data: quizData, error: quizError } = await supabase.from(QUIZ_TABLE).insert(quizInsert).select().single()
//       if (quizError || !quizData)
//         throw quizError
//       const quizId = quizData.id
//       // Dodaj pytania i powiązania quiz_question
//       await Promise.all(questions.map(async (q) => {
//         // Dodaj pytanie jeśli nie istnieje
//         const { data: _questionData, error: questionError } = await supabase.from('question').insert(questionToDbQuestion(q)).select().single()
//         if (questionError && questionError.code !== '23505')
//           throw questionError // 23505 = duplicate
//         await supabase.from('quiz_question').insert({
//           quizId,
//           questionId: q.id,
//         })
//         // Dodaj odpowiedzi do pytania
//         await Promise.all(q.answers.map(async (a) => {
//           await supabase.from('answer').insert(answerToDbAnswer(a))
//           await supabase.from('question_answer').insert({
//             questionId: q.id,
//             answerId: a.id,
//           })
//         }))
//       }))
//       await fetchQuiz(quizId)
//     }
//     catch (err: any) {
//       error.value = err
//     }
//     finally {
//       loading.value = false
//     }
//   }

//   async function fetchQuiz(quizId: string) {
//     loading.value = true
//     error.value = null
//     try {
//       // Pobierz quiz z powiązaniami w jednym zapytaniu
//       const { data: quizData, error: quizError } = await supabase
//         .from(QUIZ_TABLE)
//         .select(`
//           *,
//           prize:prizeId(*),
//           quiz_question:quiz_question(
//             question:questionId(
//               *,
//               question_answer:question_answer(
//                 answer:answerId(*)
//               )
//             )
//           )
//         `)
//         .eq('id', quizId)
//         .single()
//       if (quizError || !quizData)
//         throw quizError
//       // Mapowanie do typu Quiz
//       const questions = (quizData.quiz_question || []).map((qq: any) => {
//         const q = qq.question
//         const answers = (q.question_answer || []).map((qa: any) => dbAnswerToAnswer(qa.answer))

//         return dbQuestionToQuestion(q, answers)
//       })
//       const prizes = quizData.prize
//         ? [dbPrizeToPrize(quizData.prize)]
//         : []
//       quiz.value = dbQuizToQuiz(quizData, prizes, questions)
//     }
//     catch (err: any) {
//       error.value = err
//       quiz.value = null
//     }
//     finally {
//       loading.value = false
//     }
//   }

//   async function fetchQuizzes() {
//     loading.value = true
//     error.value = null
//     try {
//       // Pobierz wszystkie quizy z powiązaniami w jednym zapytaniu
//       const { data: quizzes, error: quizError } = await supabase
//         .from(QUIZ_TABLE)
//         .select(`
//           *,
//           prize:prizeId(*),
//           quiz_question:quiz_question(
//             question:questionId(
//               *,
//               question_answer:question_answer(
//                 answer:answerId(*)
//               )
//             )
//           )
//         `)
//       if (quizError)
//         throw quizError
//       const quizzesWithDetails = (quizzes || []).map((quizData: any) => {
//         const questions = (quizData.quiz_question || []).map((qq: any) => {
//           const q = qq.question
//           const answers = (q.question_answer || []).map((qa: any) => dbAnswerToAnswer(qa.answer))

//           return dbQuestionToQuestion(q, answers)
//         })
//         const prizes = quizData.prize
//           ? [dbPrizeToPrize(quizData.prize)]
//           : []

//         return dbQuizToQuiz(quizData, prizes, questions)
//       })

//       return quizzesWithDetails
//     }
//     catch (err: any) {
//       error.value = err

//       return []
//     }
//     finally {
//       loading.value = false
//     }
//   }

//   async function updateQuiz(quizId: string, updatedQuiz: Quiz) {
//     loading.value = true
//     error.value = null
//     try {
//       // Aktualizuj quiz
//       const { description, timeLimit, maxAttempts, prizes, questions } = updatedQuiz
//       let prizeId: string
//       if (prizes.length > 0) {
//         const mainPrize = prizes[0]
//         if (!mainPrize)
//           throw new Error('Quiz musi mieć przynajmniej jedną nagrodę')
//         const placeFrom = Array.isArray(mainPrize.place)
//           ? mainPrize.place[0]
//           : mainPrize.place
//         const placeTo = Array.isArray(mainPrize.place)
//           ? mainPrize.place[1]
//           : mainPrize.place
//         const { data: existingPrize, error: findPrizeError } = await supabase.from('prize').select('id').eq('placeFrom', placeFrom).eq('placeTo', placeTo).eq('reward', mainPrize.reward).maybeSingle()
//         if (findPrizeError)
//           throw findPrizeError
//         if (existingPrize) {
//           prizeId = existingPrize.id
//         }
//         else {
//           const { data: prizeData, error: prizeError } = await supabase.from('prize').insert(prizeToDbPrize(mainPrize)).select().single()
//           if (prizeError || !prizeData)
//             throw prizeError
//           prizeId = prizeData.id
//         }
//       }
//       else {
//         throw new Error('Quiz musi mieć przynajmniej jedną nagrodę')
//       }
//       const { error: quizError } = await supabase.from(QUIZ_TABLE).update({
//         description,
//         timeLimit,
//         maxAttempts,
//         prizeId,
//       }).eq('id', quizId)
//       if (quizError)
//         throw quizError
//       // Aktualizuj pytania (tu można rozwinąć logikę do pełnej synchronizacji)
//       // Na razie: usuwamy stare powiązania i dodajemy nowe
//       await supabase.from('quiz_question').delete().eq('quizId', quizId)
//       await Promise.all(questions.map(async (q) => {
//         const { data: _questionData, error: questionError } = await supabase.from('question').upsert(questionToDbQuestion(q))
//         if (questionError)
//           throw questionError
//         await supabase.from('quiz_question').insert({
//           quizId,
//           questionId: q.id,
//         })
//         await supabase.from('question_answer').delete().eq('questionId', q.id)
//         await Promise.all(q.answers.map(async (a) => {
//           await supabase.from('answer').upsert(answerToDbAnswer(a))
//           await supabase.from('question_answer').insert({
//             questionId: q.id,
//             answerId: a.id,
//           })
//         }))
//       }))
//       await fetchQuiz(quizId)
//     }
//     catch (err: any) {
//       error.value = err
//     }
//     finally {
//       loading.value = false
//     }
//   }

//   async function deleteQuiz(quizId: string) {
//     loading.value = true
//     error.value = null
//     try {
//       // Usuń powiązania quiz_question
//       await supabase.from('quiz_question').delete().eq('quizId', quizId)
//       // Usuń quiz
//       const { error: quizError } = await supabase.from(QUIZ_TABLE).delete().eq('id', quizId)
//       if (quizError)
//         throw quizError
//       quiz.value = null
//     }
//     catch (err: any) {
//       error.value = err
//     }
//     finally {
//       loading.value = false
//     }
//   }

//   function clearStore() {
//     quiz.value = null
//     error.value = null
//     loading.value = false
//   }

//   return {
//     quiz,
//     error,
//     loading,
//     addQuiz,
//     fetchQuiz,
//     fetchQuizzes,
//     updateQuiz,
//     deleteQuiz,
//     clearStore,
//   }
// })
