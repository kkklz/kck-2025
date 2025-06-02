export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  attemptDate: Date
  finalScore: number
  questionsAnswered: number
  currentStreak: number
  status: 'started' | 'submitted'
}
