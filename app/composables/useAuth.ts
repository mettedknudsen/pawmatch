export const useAuth = () => {
  const supabase = useSupabaseClient()

  const user = useSupabaseUser()

  const {data: profile } = useAsyncData('profile', async () => {
    if (!user.value) return null
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.value.sub)
      .single()
    return data
  })
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isLoggedIn = computed(() => !!user.value)
  async function signOut() {
    await supabase.auth.signOut()

    window.location.href = '/'
  }

  return { user, profile, isAdmin, isLoggedIn, signOut }
}
