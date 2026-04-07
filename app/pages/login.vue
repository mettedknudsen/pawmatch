<template>
  <main class="min-h-screen max-w-[400px] mx-auto px-3 lg:px-5 py-10">
    <h1 class="text-center my-10">PetMatch | Login</h1>
      <form class="space-y-4 px-10 bg-white px-3 lg:px-5 py-10" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm text-bark-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="rounded-lg border px-4 py-2.5focus:outline-none focus:border-terrakotta w-full min-h-8"
          />
        </div>
        <div>
          <label class="block text-sm text-bark-700 mb-1">Adgangskode</label>
          <input
            v-model="password"
            type="password"
            required
            class="rounded-lg border px-4 py-2.5focus:outline-none focus:border-terrakotta w-full min-h-8"
          />
        </div>

        <p v-if="error" class="text-sm text-rust-900">{{ error }}</p>

        <Button type="submit" :loading="loading" color="primary" variant="full" :icon="UserSvg" >
          Log ind
        </Button>
      </form>
    <div class="flex justify-center">
      <Button type="button" @click="navigateTo('/')" color="dark" variant="plain" :icon="BackSvg" class="mt-5" >
        Gå tilbage til forsiden
      </Button>
    </div>

  </main>
</template>
<script setup lang="ts">
import UserSvg from '~/assets/images/icons/user.svg?component'
import BackSvg from '~/assets/images/icons/back.svg?component'
import {navigateTo} from "../../.nuxt/imports";

definePageMeta({ layout: false }) // no shared layout and no footer/navbar

const supabase = useSupabaseClient()
const user = useSupabaseUser()

if (user.value) navigateTo('/')

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)


async function handleLogin() {
  loading.value = true

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
