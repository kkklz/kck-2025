import type { User } from '~/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  // const error = ref<Error>
  const supabase = useSupabaseClient()
  const USERS = 'users'

  async function handleAddUser(userData: User) {
    const { data, error: err } = await supabase.from(USERS).insert(userData as any).select()
  }
})
