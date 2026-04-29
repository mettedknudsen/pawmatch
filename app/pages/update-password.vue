<template>

  <form class="space-y-4 px-10 bg-white px-3 lg:px-5 py-5 max-w-[400px] mx-auto" @submit.prevent="handleResetPassword">
    <h1 class="text-center font-bold text-bark-500 text-lg">Ændre kodeord</h1>

    <div class="input">
      <label class="label mb-1">Adgangskode</label>
      <UInput
        v-model="newPassword"
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
    <div class="input">
      <label class="label mb-1">Gentag adgangskode</label>
      <UInput
        v-model="repeatPassword"
        placeholder="Gentag kodeord"
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
const show = ref(false)
const newPassword = ref('')
const repeatPassword = ref('')
const error = ref('')
const loading = ref(false)


async function handleResetPassword() {
  loading.value = true

  try {
    const { data, error: err } = await supabase.auth.updateUser({ password: newPassword.value })
    if (err) throw err
    toast.add({
      title: 'Din kode er ændret.',
      color: 'success',
      icon: 'i-lucide-circle-check',
      duration: 4000,
    })
    navigateTo('/')
  }
  catch (e: any) {
    error.value = 'Fejl - prøv igen'
  } finally {
    loading.value = false
  }
}
</script>
