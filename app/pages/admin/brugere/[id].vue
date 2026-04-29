<template>
  <section class="mb-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-bark-900">{{ isNew ? 'Opret bruger' : 'Bruger' }}</h1>
      <Button to="/admin/brugere" size="sm">Gå tilbage</Button>
    </div>
    <p v-if="!isNew" class="text-sm text-neutral-500 mt-3">{{ route.params.id }}</p>
    <form class="bg-white mt-5 p-3 lg:p-6 rounded-lg flex flex-wrap gap-y-4" @submit.prevent="handleSubmit">
      <div class="input w-full md:w-1/2 md:pr-2 lg:pr-4">
        <label class="label mb-1">Fulde navn</label>
        <UInput v-model="form.full_name"
                type="text"
                title="name"
                required class="w-full"/>
      </div>
      <div class="input w-full md:w-1/2 md:pr-2 lg:pr-4">
        <label class="label mb-1">Email</label>
        <UInput v-model="form.email"
                type="email"
                title="email"
                autocomplete="off"
                required
                class="w-full"/>
      </div>
      <div class="input w-full md:w-1/2 md:pr-2 lg:pr-4">
        <label class="label mb-1">Telefonnummer</label>
        <UInput v-model="form.phone"
                type="text"
                title="phone"
                autocomplete="off"
                class="w-full"/>
      </div>

      <div class="input w-full md:w-1/2 md:pr-2 lg:pr-4">
        <label class="label mb-1">Rolle</label>
        <USelect class="w-full" v-model="form.role"
                 :items="[
                    {label: 'Bruger', value: 'user' },
                    {label: 'Administrator', value: 'admin'}
                 ]"
        />
      </div>
      <div  v-if="isNew" class="w-full md:w-1/2 md:pr-2 lg:pr-4 space-y-4">
        <div class="input">
          <label class="label mb-1">Adgangskode</label>
          <UInput v-model="password"
                  type="password"
                  required
                  autocomplete="off"
                  class="w-full"/>
        </div>
        <div class="input">
          <label class="label mb-1">Gentag adgangskode</label>
          <UInput v-model="repeatPassword"
                  type="password"
                  required
                  autocomplete="off"
                  class="w-full"/>
        </div>
      </div>

      <div class="w-full">
        <Button size="sm" type="submit">
          {{ isNew ? 'Tilføj bruger' : 'Gem ændringer' }}
        </Button>
      </div>

    </form>

  </section>


</template>
<script setup lang="ts">
definePageMeta({layout: 'admin'})
const route = useRoute()
const supabase = useSupabaseClient()
const toast = useToast()

const isNew = route.params.id === 'opret'

const form = reactive({
  full_name: '',
  email: '',
  phone: '',
  role: 'user',
})

const password = ref('')
const repeatPassword = ref('')

if(!isNew) {
  const {data} = await supabase
    .from('profiles')
    .select('role, full_name, email, phone')
    .eq('id', route.params.id)
    .single()
  if (data) {
    Object.assign(form, data)
  }
}
const error = ref('')
const loading = ref(false)


async function handleSubmit() {
  loading.value = true
  error.value = ''

  if (isNew) {
    if (password.value.length < 5) {
      error.value = 'Adgangskodens skal mindst være 5 tegn'
      return
    }
    if (password.value !== repeatPassword.value) {
      error.value = 'Adgangskoderne er ikke ens'
      return
    }
  }

    try {
      if (isNew) {
        const createReq = await fetch('/api/create-user', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            email: form.email,
            password: password.value,
            data: {
              full_name: form.full_name,
              role: form.role,
              phone: form.phone,
              email: form.email
            }
          })
        })
        const data = await createReq.json()

        if (!createReq.ok) {
          throw data
        }

      } else {

        const updatereq = await fetch('/api/update-user', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            id: route.params.id,
            email: form.email,
            data: {
              full_name: form.full_name,
              role: form.role,
              phone: form.phone,
              email: form.email
            }
          })
        })
        const data = await updatereq.json()

        if (!updatereq.ok) {
          throw data
        }
      }
        toast.add({
          title: isNew ? 'Bruger blev oprettet' : 'Brugerdata blev gemt.',
          color: 'success',
          duration: 2000,
        })

      navigateTo('/admin/brugere')

    } catch (e: any) {
      console.log(e)
      toast.add({
        title: e?.statusCode || 'Fejl',
        description: e?.statusMessage || 'Der gik noget galt',
        color: 'error',
        duration: 2000,
      })
    } finally {
      loading.value = false
    }
  }

</script>
