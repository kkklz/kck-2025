import type { Prize } from './prize'
import type { QuizSummary } from './quizSummary'
import type { User } from './user'

export interface Course {
  id: string
  name: string
  description: string
  photoUrl?: string
  quizzes: QuizSummary[]
  users: User[]
  prizes: Prize[]
}
