import type { PostgrestError } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const users = ref<User[]>([])
  const error = ref<PostgrestError | null>(null)
  const loading = ref(false)
  const supabase = useSupabaseClient<Database>()
  const USER = 'user'

  function clearStore() {
    user.value = null
    error.value = null
  }

  async function addUser(userData: User) {
    const { data, error: err } = await supabase.from(USER).insert(userData).select().limit(1).single()

    if (err || data == null) {
      error.value = err

      return
    }

    user.value = data as User
  }

  async function fetchUser(userId: string) {
    const { data, error: err } = await supabase.from(USER).select().eq('id', userId).limit(1).single()

    if (err || data == null) {
      error.value = err

      return
    }

    user.value = data as User
  }

  async function fetchUsers() {
    error.value = null
    loading.value = true

    try {
      const { data, error: err } = await supabase.from(USER).select()
      if (err)
        throw err

      users.value = data as User[] || []
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    user,
    users,
    loading,
    addUser,
    fetchUser,
    clearStore,
    fetchUsers,
  }
})
