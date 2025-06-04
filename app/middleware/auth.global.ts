export default defineNuxtRouteMiddleware(async (to, _from) => {
  const supabase = useSupabaseClient()
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  if (!user.value) {
    const newUser = (await supabase.auth.getUser()).data.user
    if (newUser) {
      await userStore.fetchUser(newUser.id)
    }
  }

  if (user.value?.role === 'student' && to.path.startsWith('/admin')) {
    return navigateTo('/')
  }

  return true
})
