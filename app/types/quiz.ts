import type { Question } from './question'
import type { QuizSummary } from './quizSummary'

export interface Quiz extends QuizSummary {
  questions: Question[]
}
