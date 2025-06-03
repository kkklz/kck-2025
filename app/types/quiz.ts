import type { InputQuestion, Question } from './question'
import type { QuizSummary } from './quizSummary'

export interface Quiz extends QuizSummary {
  questions: Question[]
}

export type InputQuiz = Omit<Quiz, 'id' | 'courseId' | 'questions'> & { questions: InputQuestion[] }
