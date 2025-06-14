import type { Answer } from '@/types/answer'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import type { Prize } from '@/types/prize'
import type { Question } from '@/types/question'
import type { Quiz } from '@/types/quiz'
import type { Course } from '~/types/course'
import type { QuizAttempt } from '~/types/quizAttempt'
import type { QuizSummary } from '~/types/quizSummary'
import type { User } from '~/types/user'

export type DBUser = Tables<'user'>
export type DBCourse = Tables<'course'>
export type DBQuiz = Tables<'quiz'>
export type DBPrize = Tables<'prize'>
export type DBQuestion = Tables<'question'>
export type DBAnswer = Tables<'answer'>
export type DBQuizAttempt = Tables<'quiz_attempt'>

export type DBQuizAttemptUpdate = TablesUpdate<'quiz_attempt'>
export type DBCourseUpdate = TablesUpdate<'course'>

export type DBCourseInsert = TablesInsert<'course'>
export type DBQuizInsert = TablesInsert<'quiz'>
export type DBPrizeInsert = TablesInsert<'prize'>
export type DBQuestionInsert = TablesInsert<'question'>
export type DBAnswerInsert = TablesInsert<'answer'>
export type DBQuizAttemptInsert = TablesInsert<'quiz_attempt'>

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

export function quizToDbQuiz(quiz: Omit<Quiz, 'courseId'>, courseId: string): DBQuizInsert {
  return {
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
  // todo: ranking
  return {
    id: dbCourse.id,
    name: dbCourse.name,
    description: dbCourse.description,
    quizzes,
    prizes,
    users,
    photoUrl: dbCourse.photoUrl || undefined,
  }
}

export function courseToDbCourse(course: Partial<Course>): DBCourseInsert {
  const data: DBCourseInsert = {
    name: course.name || '',
    description: course.description || '',
  }

  if (course.id !== undefined)
    data.id = course.id
  if (course.photoUrl !== undefined)
    data.photoUrl = course.photoUrl

  return data
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

// --- Quiz Attempt ---
export function dbQuizAttemptToQuizAttempt(dbQuizAttempt: DBQuizAttempt): QuizAttempt {
  const convertToLocalDate = (dateString: string) => {
    const date = new Date(dateString)

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  }

  return {
    id: dbQuizAttempt.id,
    quizId: dbQuizAttempt.quizId,
    userId: dbQuizAttempt.userId,
    attemptDate: convertToLocalDate(dbQuizAttempt.attemptDate),
    finalScore: dbQuizAttempt.finalScore,
    questionsAnswered: dbQuizAttempt.questionAnswered,
    currentStreak: dbQuizAttempt.currentStreak,
    status: dbQuizAttempt.status,
    dueDate: convertToLocalDate(dbQuizAttempt.dueDate),
    currentBonus: dbQuizAttempt.currentBonus || null,
  }
}

export function quizAttemptToDbQuizAttempt(quizAttempt: QuizAttempt): DBQuizAttemptInsert {
  return {
    quizId: quizAttempt.quizId,
    userId: quizAttempt.userId,
    attemptDate: quizAttempt.attemptDate.toISOString(),
    finalScore: quizAttempt.finalScore,
    questionAnswered: quizAttempt.questionsAnswered,
    currentStreak: quizAttempt.currentStreak,
    status: quizAttempt.status,
    dueDate: quizAttempt.dueDate.toISOString(),
    currentBonus: quizAttempt.currentBonus || null,
  }
}
