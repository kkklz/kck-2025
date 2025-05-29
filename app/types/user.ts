export interface User {
  id: string
  firstName: string
  lastName: string
  photoUrl?: string | null
  role: 'admin' | 'student'
  studentIndex?: string | null
}
