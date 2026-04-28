<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-bark-900">Brugere</h1>
    <Button :icon="PlusSvg" to="/admin/brugere/opret">Tilføj bruger</Button>
  </div>

  <div class="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
    <table class="w-full text-sm">

      <thead class="bg-neutral-50 border-b border-neutral-200">
      <tr>
        <th class="text-left text-bark-500  px-4 py-3 font-medium">Bruger</th>
        <th class="text-left text-bark-500  px-4 py-3 max-sm:hidden font-medium">E-mail</th>
        <th class="text-left text-bark-500  px-4 py-3 max-md:hidden font-medium">Telefon</th>
        <th class="px-4 py-3"></th>
      </tr>
      </thead>


      <tbody class="divide-y divide-neutral-100">
      <tr v-for="user in users" :key="user.id">
        <td class="px-4 py-3 space-y-3">
          <NuxtLink class="hover:text-terrakotta text-bark-900" :to="`/admin/brugere/${user.id}`">{{ user.full_name }}</NuxtLink>
          <p class="text-neutral-500 text-xs mt-1" v-if="user.role">Rolle: {{user.role === 'admin' ? 'Administrator' : 'Bruger'}}</p>
          <div class="sm:hidden text-neutral-500 text-xs" v-if="user.email">
            <a :href="`mailto:${user.email}`"  class="text-terrakotta">{{ user.email}}</a>
          </div>
          <div class="md:hidden text-neutral-500 text-xs" v-if="user.phone">
            <a :href="`tel:${user.phone}`"  class="text-terrakotta">{{ user.phone}}</a>
          </div>
        </td>
        <td class="px-4 py-3 text-neutral-600 max-sm:hidden">
          <a v-if="user.email" :href="`mailto:${user.email}`"  class="text-terrakotta">{{ user.email}}</a>
          <span v-else>-</span>
        </td>
        <td class="px-4 py-3 text-neutral-600 max-md:hidden">
          <a v-if="user.phone" :href="`tel:${user.phone}`"  class="text-terrakotta">{{ user.phone}}</a>
          <span v-else>-</span>
        </td>
        <td class="px-4 py-3 flex flex-wrap gap-2 justify-end">
          <Button variant="bordered" color="dark" :to="`/admin/brugere/${user.id}`" size="sm" :icon="EditSvg">Rediger</Button>

          <Button variant="bordered" color="alert" size="sm" @click="deleteUser(user.id)" class="bg-white hover:bg-rust-900 hover:text-white">
            Slet
          </Button>
        </td>
      </tr>
      </tbody>

    </table>
  </div>
</template>
<script setup lang="ts">
import EditSvg from '~/assets/images/icons/edit.svg?component'
import PlusSvg from '~/assets/images/icons/plus.svg?component'

definePageMeta({ layout: 'admin' })

const toast = useToast()
const supabase = useSupabaseClient()


const { data: users, refresh } = await useAsyncData('admin-users', async () => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true })
  return data
})

async function deleteUser(id: string) {
  if (!confirm('Er du sikker?')) return
  try {
    const deleteReq = await fetch('/api/delete-user', {
      method: 'POST',
      credentials: 'include',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({userId: id})
    })
    const data = await deleteReq.json()

    if (!deleteReq.ok) {
      throw data
    }
    toast.add({
      title: 'Brugeren blev slettet.',
      color: 'success',
      duration: 2000,
    })
    refresh()
  } catch (e: any) {
    console.log(e)
    toast.add({
      title: e?.data?.statusCode || 'Fejl',
      description: e?.data?.statusMessage || 'Kunne ikke slette bruger',
      color: 'error',
      duration: 2000,
    })
  }
}
</script>
