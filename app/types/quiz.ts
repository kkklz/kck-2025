import type { Question } from './question'

export interface Quiz {
  id: string
  editorId: string
  groupIds: string[]
  questions: Question[]
}
