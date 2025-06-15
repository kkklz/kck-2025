import type { User } from './user'

export interface RankingPlace {
  user: User
  points: number
  position: number
}
