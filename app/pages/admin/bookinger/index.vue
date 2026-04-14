<template>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-bark-900">Bookinger</h1>
        <Button @click="navigateTo('/admin/bookinger/opret')" :icon="PlusSvg">Tilføj booking</Button>
    </div>
      <BookingTable :bookings="bookings" :default-rows="12" :refresh="refresh"/>
</template>

<script setup lang="ts">
import PlusSvg from '~/assets/images/icons/plus.svg?component'
import BookingTable from "../../../components/admin/BookingTable.vue";
definePageMeta({ layout: 'admin' })

const loading = ref(false)

const supabase = useSupabaseClient()

const { data: bookings, refresh } = await useAsyncData('admin-bookings', async () => {
  loading.value = true
  const { data } = await supabase
    .from('bookings_with_details')
    .select('*')
    .neq('status', 'completed')
  loading.value = false
  return data
})

onMounted(() => {
  refresh()
})
</script>
