import {useRoute} from "vue-router";
import {navigateTo} from "../../.nuxt/imports";

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const route = useRoute()
  const toast = useToast()

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
    console.log(route.path.includes('/admin'))
    if (route.path.includes('/admin')) navigateTo('/')
    clearNuxtData('profile')
    toast.add({
      title: 'Du er nu logget ud.',
      icon: 'i-lucide-log-out',
      color: 'success',
      duration: 2000,
    })
  }

  return { user, profile, isAdmin, isLoggedIn, signOut }
}
