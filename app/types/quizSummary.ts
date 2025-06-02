import type { Prize } from './prize'

export interface QuizSummary {
  id: string
  description: string
  timeLimit: number
  maxAttempts: number
  prizes: Prize[]
}
