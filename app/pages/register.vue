<template>
    <form class="space-y-4 px-10 bg-white px-3 lg:px-5 py-10 max-w-[400px] mx-auto" @submit.prevent="handleSignup">
      <h1 class="text-center font-bold text-bark-500 text-lg">Opret bruger</h1>
      <div>
        <label class="block text-sm text-bark-700 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          title="email"
          required
          class="rounded-lg border border-bark-300 px-4 py-1.5 focus:outline-terrakotta w-full min-h-8"
        />
      </div>
      <div>
        <label class="block text-sm text-bark-700 mb-1">Dit fulde navn</label>
        <input
          v-model="name"
          type="text"
          title="name"
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
      <div>
        <label class="block text-sm text-bark-700 mb-1">Gentag adgangskode</label>
        <input
          v-model="repeatPassword"
          type="password"
          required
          class="rounded-lg border border-bark-300 px-4 py-1.5 focus:outline-terrakotta  w-full min-h-8"
        />
      </div>

      <p v-if="error" class="text-sm text-rust-900">{{ error }}</p>
      <div class="flex items-center space-x-1">
      <Button type="submit" :loading="loading" color="primary" variant="full" :icon="UserSvg">
        Opret bruger
      </Button>
      <Button type="button" @click="navigateTo('/login')" color="primary" variant="plain" >
        Jeg har en bruger
      </Button>
      </div>
    </form>

</template>

<script setup lang="ts">
import UserSvg from '~/assets/images/icons/user.svg?component'
definePageMeta({ layout: 'account' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()

if (user.value) navigateTo('/')

const email = ref('')
const name = ref('')
const password = ref('')
const repeatPassword = ref('')
const error = ref('')
const loading = ref(false)


async function handleSignup() {
  if (password.value !== repeatPassword.value) {
    error.value = 'Adgangskoderne er ikke ens'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const {data, error: err} = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: name.value,
        }
      }
    })
    if (err) throw err

    navigateTo('/')
  }

  catch (e: any) {
    error.value = 'Der skete en fejl - prøv igen'
  } finally {
    loading.value = false
  }
}
</script>
