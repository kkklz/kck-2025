import type { User as AuthUser } from '@supabase/supabase-js'
import type { User } from '@/types/user'
import { AuthError } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

type RegisterUser = Omit<User, 'id' | 'email' | 'photoUrl'>

export const useAuthStore = defineStore('auth', () => {
  const authUser: Ref<AuthUser | null> = ref(null)
  const error: Ref<AuthError | null> = ref(null)

  const supabase = useSupabaseClient()
  const router = useRouter()
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  async function register(email: string, password: string, userData: RegisterUser) {
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

    if (data.user == null) {
      error.value = new AuthError('No user')

      return
    }

    userStore.addUser({
      id: data.user.id,
      ...userData,
    })

    authUser.value = data.user

    router.push('/')
  }

  async function login(email: string, password: string) {
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (err) {
      error.value = err

      return
    }

    authUser.value = data.user

    router.push('/')
  }

  async function logout() {
    error.value = null
    const { error: err } = await supabase.auth.signOut()
    authUser.value = null
    if (err) {
      error.value = err

      return
    }

    authUser.value = null
    router.push('/login')
  }

  function setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
      authUser.value = session?.user || null
      setTimeout(async () => {
        // dodatkowy warunek user.value === null, bo state change jest wywolywany nawet przy focusie na karte (np. przy zmianie kart w przegladarce)
        // dodatkowo zgodnie z dokumentacja, nie wiedziec dlaczego, event SIGNED_IN jest wywolywany przy focusie na karte, a nie tylko przy logowaniu
        if (authUser.value != null && user.value === null) {
          await userStore.fetchUser(authUser.value.id)
        }
      }, 0)
    })
  }

  return {
    authUser,
    error,
    register,
    login,
    logout,
    setupAuthListener,
  }
})
