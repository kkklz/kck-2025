import type { Answer } from './answer'

export interface Question {
  id: string
  content: string
  points: number
  answers: Answer[]
}
