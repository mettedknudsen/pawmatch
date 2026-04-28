<template>
  <main class="pawmatch-container py-10 min-h-[70vh] flex justify-center items-start">
    <section class="bg-white text-bark-900 max-w-200 p-5">
      <h1 class="font-bold font-inter text-xl">Dine brugeroplysninger</h1>
      <div class="flex flex-wrap gap-4 my-5">
      <div class="input">
        <label class="label mb-1">Fulde navn</label>
        <UInput v-model="form.full_name" type="text" icon="i-lucide-user-round"/>
      </div>
      <div class="input">
        <label class="label mb-1">Email</label>
        <UInput v-model="form.email" type="email" disabled icon="i-lucide-mail"/>
      </div>
      <div class="input">
        <label class="label mb-1">Telefon</label>
        <UInput v-model="form.phone" type="text" icon="i-lucide-phone"/>
      </div>
      <div class="input">
        <label class="label mb-1">Kodeord</label>
        <UInput v-model="form.password" type="password" icon="i-lucide-lock" placeholder="*********" autocomplete="off" />
      </div>
        <div class="input">
        <label class="label mb-1">Bekræft kodeord</label>
        <UInput v-model="form.confirmpassword" type="password" icon="i-lucide-lock" placeholder="*********" autocomplete="off" />
      </div>
      </div>

      <div v-if="error" class="my-5">
        <span  class="text-sm text-rust-900 col-span-2 p-2 bg-rust-300/50 rounded-lg border">{{error}}</span>
      </div>
      <Button @click="save" :loading="loading">Gem ændringer</Button>
    </section>

  </main>
</template>
<script setup lang="ts">
const {isLoggedIn} = useAuth()
if (!isLoggedIn.value) {
  await navigateTo('/login')
}
const toast = useToast()
const supabase = useSupabaseClient()
// const user = useSupabaseUser()
const { data: { user } } = await supabase.auth.getUser()


const form = reactive({
  full_name: user?.user_metadata?.full_name,
  email: user?.email,
  phone: user?.user_metadata?.phone,
  password: '',
  confirmpassword: ''
})

const loading = ref(false)
const error = ref('')
async function save() {
  loading.value = true

  try {
    const updates: any = {}
    const data: any = {}

    if (form.full_name !== user?.user_metadata?.full_name){
      if(!form.full_name) {
        error.value = 'Navn er påkrævet'
        throw new Error('Navn er påkrævet');
      }
      updates.full_name = form.full_name
      data.full_name = form.full_name
    }
    if (form.email !== user?.email){
      if(!form.email) {
        error.value = 'Email er påkrævet'
        throw new Error('Email er påkrævet');
      }
      updates.email = form.email
      data.email = form.email
    }
    if (form.phone !== user?.user_metadata?.phone){
      data.phone = form.phone || ''
    }
    if (form.password && form.confirmpassword){
      if(form.password !== form.confirmpassword) {
        error.value = 'Kodeordene stemmer ikke overens'
        throw new Error('Kodeordene stemmer ikke overens');
      }
      else if(form.password.length < 5) {
        error.value = 'Kodeord skal være mindst 5 tegn'
        throw new Error('Kodeord skal være mindst 5 tegn');
      }
      updates.password = form.password
    }
    // add data object to the updates
    if(Object.keys(data).length){
      updates.data = data
    }
    console.log(updates)
    // if there's no updates do not call the api
    if(!Object.keys(updates).length){
      error.value = 'Der var ingen ændringer'
      return
    }

    const { error: err } = await supabase.auth.updateUser(updates)
    if (err) throw err
    else {
      toast.add({
        title: 'Ændringerne blev gemt.',
        color: 'success',
        duration: 2500,
      })
    }
  }
  catch (e:any) {error.value = e.message ?? 'Bruger kunne ikke opdateres.'}
  finally {loading.value = false}

}

</script>
