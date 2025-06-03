import type { Answer, InputAnswer } from './answer'

export interface Question {
  id: string
  content: string
  points: number
  answers: Answer[]
}

export type InputQuestion = Omit<Question, 'id' | 'answers'> & { answers: InputAnswer[] }
