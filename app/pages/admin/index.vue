<template>

    <h1 class="text-bark-900 text-2xl font-bold mb-8">Overblik</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <article class="border border-neutral-200 p-6 rounded-2xl max-lg:text-center" :class="loading ? 'animate-pulse bg-neutral-300' : 'bg-white'">
        <p class="text-neutral-500 text-sm">Bookinger</p>
        <p class="text-bark-900 text-4xl font-bold mt-1">{{ stats?.totalBookings }}</p>
      </article>
      <article class="border border-neutral-200 p-6 rounded-2xl max-lg:text-center"  :class="loading ? 'animate-pulse bg-neutral-300' : 'bg-white'">
        <p class="text-neutral-500 text-sm">Ledige dyr</p>
        <p class="text-bark-900 text-4xl font-bold mt-1">{{ stats?.available }}</p>
      </article>
      <article class="border border-neutral-200 p-6 rounded-2xl max-lg:text-center" :class="loading ? 'animate-pulse bg-neutral-300' : 'bg-white'">
        <p class="text-neutral-500 text-sm">Reserverede</p>
        <p class="text-bark-900 text-4xl font-bold mt-1">{{ stats?.reserved }}</p>
      </article>
      <article class="border border-neutral-200 p-6 rounded-2xl max-lg:text-center" :class="loading ? 'animate-pulse bg-neutral-300' : 'bg-white'">
        <p class="text-neutral-500 text-sm">Adopterede</p>
        <p class="text-bark-900 text-4xl font-bold mt-1">{{ stats?.adopted }}</p>
      </article>

    </div>
    <section class="my-10">
      <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl text-bark-500">Bookinger i dag</h3>
        <Button variant="bordered" class="text-terrakotta hover:bg-terrakotta hover:text-white" size="sm" to="/admin/bookinger">Se alle bookinger</Button>
      </div>

      <BookingTable :loading="loading" :bookings="todaysBookings" :default-rows="3"  :refresh="refresh"/>
    </section>

</template>
<script setup lang="ts">

import BookingTable from "../../components/admin/BookingTable.vue";

definePageMeta({ layout: 'admin' })

const loading = ref(false)

const supabase = useSupabaseClient()

const { data, refresh} = await useAsyncData('admin-overview', async () => {
  loading.value = true
  const [animals, bookings, todaysBookings] = await Promise.all([
    supabase.from('animals').select('status'),
    supabase.from('bookings').select('id').eq('status', 'confirmed'),
    supabase.from('todays_bookings').select('*'),
  ])
  loading.value = false
  return {
    available: animals.data?.filter(a => a.status === 'available').length ?? 0,
    adopted: animals.data?.filter(a => a.status  === 'adopted').length ?? 0,
    reserved:animals.data?.filter(a => a.status === 'reserved').length ?? 0,
    totalBookings: bookings.data?.length ?? 0,
    todaysBookings: todaysBookings.data ?? [],
  }
})
onMounted(() => {
  refresh()
})

const stats = computed(() => data.value)
const todaysBookings = computed(() => data.value?.todaysBookings ?? [])
</script>
