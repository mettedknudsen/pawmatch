<template>

    <form class="space-y-4 px-10 bg-white px-3 lg:px-5 py-5 max-w-[400px] mx-auto" @submit.prevent="handleResetPassword">
      <h1 class="text-center font-bold text-bark-500 text-lg">Glemt kodeord</h1>
      <div class="input">
        <label class="label mb-1">Din email</label>
        <UInput
          v-model="email"
          type="email"
          required
          class="w-full"
        />
      </div>

      <p v-if="error" class="text-sm text-rust-900">{{ error }}</p>
      <div class="flex items-center space-x-1">
        <Button type="submit" :loading="loading" color="primary" variant="full" >
          Nulstil kodeord
        </Button>
        <Button type="button" to="/login" color="primary" variant="plain" >
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
const toast = useToast()
const email = ref('')
const error = ref('')
const loading = ref(false)
const redirectTo = `${import.meta.env.VITE_SITE_URL}/update-password`

async function handleResetPassword() {
  loading.value = true

  try {
    const { data, error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo,
    })
    if (err) throw err
    toast.add({
      title: 'Mail sendt - tjek indbakke',
      color: 'success',
      icon: 'i-lucide-circle-check',
      duration: 4000,
    })
  }
  catch (e: any) {
    error.value = 'Fejl - prøv igen'
  } finally {
    loading.value = false
  }
}
</script>
