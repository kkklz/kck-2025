export interface Answer {
  id: string
  answer: string
  correct: boolean
}

export type InputAnswer = Omit<Answer, 'id'>
