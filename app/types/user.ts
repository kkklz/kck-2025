export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  role: 'admin' | 'lecturer' | 'student'
  groupIds: string[]
}
