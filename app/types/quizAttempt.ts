export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  attemptDate: Date
  finalScore: number
  questionsAnswered: number
  currentStreak: number
  status: 'started' | 'submitted'
  dueDate: Date
  currentBonus: 'minigame_shooter' | 'minigame_memory' | '50_50' | 'bonus_time' | null
}
