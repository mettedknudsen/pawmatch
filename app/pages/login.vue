<template>
      <form class="space-y-4 px-10 bg-white px-3 lg:px-5 py-10 max-w-[400px] mx-auto" @submit.prevent="handleLogin">
        <h1 class="text-center font-bold text-bark-500 text-lg">Login</h1>
        <div>
          <label class="block text-sm text-bark-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="rounded-lg border border-bark-300 px-4 py-1.5 focus:outline-terrakotta w-full min-h-8"
          />
        </div>
        <div>
          <label class="block text-sm text-bark-700 mb-1">Adgangskode</label>
          <input
            v-model="password"
            type="password"
            required
            class="rounded-lg border border-bark-300 px-4 py-1.5 focus:outline-terrakotta  w-full min-h-8"
          />
        </div>

        <p v-if="error" class="text-sm text-rust-900">{{ error }}</p>
        <div class="flex items-center space-x-1">
        <Button type="submit" :loading="loading" color="primary" variant="full" :icon="UserSvg" >
          Log ind
        </Button>
        <Button type="button" @click="navigateTo('/register')" color="primary" variant="bordered" class="ml-3">
          Opret bruger
        </Button>
        </div>
        <NuxtLink to="/forgot-password" class="text-xs block text-terrakotta hover:text-terrakotta-hover">Glemt dit kodeord? Tryk her</NuxtLink>
      </form>
</template>
<script setup lang="ts">
import UserSvg from '~/assets/images/icons/user.svg?component'

definePageMeta({ layout: 'account' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()

if (user.value && user.value.user_metadata.role) {
  if (user.value.user_metadata.role === 'admin') navigateTo('/admin')
  else navigateTo('/')
}

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)


async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const {error: err} = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (err) throw err
    const {data:profile} = await supabase.from('profiles')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user!.id)
      .single()

    navigateTo(profile?.role === 'admin' ? '/admin' : '/')
  }

  catch (e: any) {
    error.value = 'Forkert email eller adgamgskode'
  } finally {
    loading.value = false
  }
}
</script>
