import type { Answer } from '@/types/answer'
import type { Tables, TablesInsert } from '@/types/database.types'
import type { Prize } from '@/types/prize'
import type { Question } from '@/types/question'
import type { Quiz } from '@/types/quiz'

export type DBQuiz = Tables<'quiz'>
export type DBPrize = Tables<'prize'>
export type DBQuestion = Tables<'question'>
export type DBAnswer = Tables<'answer'>

export type DBQuizInsert = TablesInsert<'quiz'>
export type DBPrizeInsert = TablesInsert<'prize'>
export type DBQuestionInsert = TablesInsert<'question'>
export type DBAnswerInsert = TablesInsert<'answer'>

// --- Prize ---
export function dbPrizeToPrize(dbPrize: DBPrize): Prize {
  return {
    place:
      dbPrize.placeFrom === dbPrize.placeTo
        ? dbPrize.placeFrom
        : [dbPrize.placeFrom, dbPrize.placeTo],
    reward: dbPrize.reward,
  }
}

export function prizeToDbPrize(prize: Prize): DBPrizeInsert {
  const placeFrom = Array.isArray(prize.place)
    ? prize.place[0]
    : prize.place
  const placeTo = Array.isArray(prize.place)
    ? prize.place[1]
    : prize.place

  return {
    placeFrom,
    placeTo,
    reward: prize.reward,
  }
}

// --- Answer ---
export function dbAnswerToAnswer(dbAnswer: DBAnswer): Answer {
  return {
    id: dbAnswer.id,
    answer: dbAnswer.answer,
    correct: dbAnswer.correct,
  }
}

export function answerToDbAnswer(answer: Answer): DBAnswerInsert {
  return {
    id: answer.id,
    answer: answer.answer,
    correct: answer.correct,
  }
}

// --- Question ---
export function dbQuestionToQuestion(dbQuestion: DBQuestion, answers: Answer[]): Question {
  return {
    id: dbQuestion.id,
    content: dbQuestion.content,
    points: dbQuestion.points,
    answers,
  }
}

export function questionToDbQuestion(question: Question): DBQuestionInsert {
  return {
    id: question.id,
    content: question.content,
    points: question.points,
  }
}

// --- Quiz ---
export function dbQuizToQuiz(dbQuiz: DBQuiz, prize: Prize[], questions: Question[]): Quiz {
  return {
    id: dbQuiz.id,
    description: dbQuiz.description,
    timeLimit: dbQuiz.timeLimit,
    maxAttempts: dbQuiz.maxAttempts,
    prizes: prize,
    questions,
  }
}

export function quizToDbQuiz(quiz: Quiz, prizeId: string): DBQuizInsert {
  return {
    id: quiz.id,
    description: quiz.description,
    timeLimit: quiz.timeLimit,
    maxAttempts: quiz.maxAttempts,
    prizeId,
  }
}
