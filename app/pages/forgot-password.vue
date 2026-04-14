<template>

    <form class="space-y-4 px-10 bg-white px-3 lg:px-5 py-5 max-w-[400px] mx-auto" @submit.prevent="handleResetPassword">
      <h1 class="text-center font-bold text-bark-500 text-lg">Glemt kodeord</h1>
      <div>
        <label class="block text-sm text-bark-700 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="rounded-lg border border-bark-300 px-4 py-1.5 focus:outline-terrakotta w-full min-h-8"
        />
      </div>

      <p v-if="error" class="text-sm text-rust-900">{{ error }}</p>
      <div class="flex items-center space-x-1">
        <Button type="submit" :loading="loading" color="primary" variant="full" >
          Nulstil kodeord
        </Button>
        <Button type="button" @click="navigateTo('/login')" color="primary" variant="plain" >
          Tilbage til login
        </Button>
      </div>

    </form>

</template>

<script setup lang="ts">
definePageMeta({ layout: 'account' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()

if (user.value) navigateTo('/')

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)


async function handleResetPassword() {
  loading.value = true

  try {
    const { data, error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: 'http://localhost:3000/update-password',
    })
    if (err) throw err

  }
  catch (e: any) {
    error.value = 'Fejl - prøv igen'
  } finally {
    loading.value = false
  }
}
</script>
