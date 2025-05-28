import type { AuthError, User as AuthUser } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<AuthUser | null> = ref(null)
  const error: Ref<AuthError | null> = ref(null)

  const supabase = useSupabaseClient()
  const router = useRouter()

  async function handleRegister(email: string, password: string) {
    // TODO: Dodanie pozostałych pól z formularza rejestracji oraz zaimplementowanie Users Store do dodania ich do bazy danych
    error.value = null
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
    })

    if (err) {
      error.value = err

      return
    }

    user.value = data.user

    router.push('/')
  }

  async function handleLogin(email: string, password: string) {
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (err) {
      error.value = err

      return
    }

    user.value = data.user

    router.push('/')
  }

  async function handleLogout() {
    error.value = null
    const { error: err } = await supabase.auth.signOut()
    user.value = null
    if (err) {
      error.value = err

      return
    }

    user.value = null
    router.push('/login')
  }

  async function init() {
    error.value = null
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      user.value = session.user
    }
  }

  return {
    user,
    error,
    handleRegister,
    handleLogin,
    handleLogout,
    init,
  }
})
