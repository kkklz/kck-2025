import type { Answer } from '@/types/answer'
import type { Tables, TablesInsert } from '@/types/database.types'
import type { Prize } from '@/types/prize'
import type { Question } from '@/types/question'
import type { Quiz } from '@/types/quiz'
import type { Course } from '~/types/course'
import type { QuizSummary } from '~/types/quizSummary'
import type { User } from '~/types/user'

export type DBUser = Tables<'user'>
export type DBCourse = Tables<'course'>
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
    id: dbPrize.id,
    place:
      dbPrize.placeFrom === dbPrize.placeTo
        ? dbPrize.placeFrom
        : [dbPrize.placeFrom, dbPrize.placeTo],
    reward: dbPrize.reward,
  }
}

export function prizeToDbPrize(prize: Prize, courseId: string): DBPrizeInsert {
  const placeFrom = Array.isArray(prize.place)
    ? prize.place[0]
    : prize.place
  const placeTo = Array.isArray(prize.place)
    ? prize.place[1]
    : prize.place

  return {
    id: prize.id,
    placeFrom,
    placeTo,
    reward: prize.reward,
    courseId,
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

export function answerToDbAnswer(answer: Answer, questionId: string): DBAnswerInsert {
  return {
    id: answer.id,
    answer: answer.answer,
    correct: answer.correct,
    questionId,
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

export function questionToDbQuestion(question: Question, quizId: string): DBQuestionInsert {
  return {
    id: question.id,
    content: question.content,
    points: question.points,
    quizId,
  }
}

// --- Quiz ---
export function dbQuizToQuiz(dbQuiz: DBQuiz, questions: Question[]): Quiz {
  return {
    id: dbQuiz.id,
    description: dbQuiz.description,
    timeLimit: dbQuiz.timeLimit,
    maxAttempts: dbQuiz.maxAttempts,
    questions,
  }
}

export function quizToDbQuiz(quiz: Quiz, courseId: string): DBQuizInsert {
  return {
    id: quiz.id,
    description: quiz.description,
    timeLimit: quiz.timeLimit,
    maxAttempts: quiz.maxAttempts,
    courseId,
  }
}

export function dbQuizToQuizSummary(dbQuiz: DBQuiz): QuizSummary {
  return {
    id: dbQuiz.id,
    description: dbQuiz.description,
    timeLimit: dbQuiz.timeLimit,
    maxAttempts: dbQuiz.maxAttempts,
  }
}

// --- Course ---
export function dbCourseToCourse(
  dbCourse: DBCourse,
  quizzes: QuizSummary[],
  prizes: Prize[],
  users: User[],
): Course {
  // todo: photo + ranking
  return {
    id: dbCourse.id,
    name: dbCourse.name,
    description: dbCourse.description,
    quizzes,
    prizes,
    users,
  }
}

// --- User ---
export function dbUserToUser(dbUser: DBUser): User {
  // todo: photo
  return {
    id: dbUser.id,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    role: dbUser.role,
    studentIndex: dbUser.studentIndex || null,
  }
}
