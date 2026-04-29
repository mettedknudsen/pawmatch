<template>
      <form class="space-y-4 px-10 bg-white px-3 lg:px-5 py-10 max-w-[400px] mx-auto" @submit.prevent="handleLogin">
        <h1 class="text-center font-bold text-bark-500 text-lg">Login</h1>
        <div class="input">
          <label class="label mb-1">Email</label>
          <UInput
            v-model="email"
            type="email"
            required
            class="w-full"
          />
        </div>
        <div class="input">
          <label class="label mb-1">Adgangskode</label>
          <UInput
            v-model="password"
            placeholder="Kodeord"
            class="w-full"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Skjul kodeord' : 'Vis kodeord'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </div>

        <p v-if="error" class="text-sm text-rust-900">{{ error }}</p>
        <div class="flex items-center space-x-1">
        <Button type="submit" :loading="loading" color="primary" variant="full" :icon="UserSvg" >
          Log ind
        </Button>
        <Button to="/register" color="primary" variant="bordered" class="ml-3">
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
const show = ref(false)

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
