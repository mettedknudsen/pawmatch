<template>
  <main class="pawmatch-container py-10 min-h-[70vh]">
    <h1 class="text-2xl font-inter font-bold mb-5 text-bark-900">Dine bookinger</h1>
    <BookingTable :bookings="bookings" :refresh="refresh" class="[&_*]:data-[action=delete]:hidden [&_*]:data-[action=edit]:hidden"/>
  </main>

</template>
<script setup lang="ts">
const {isLoggedIn} = useAuth()
if (!isLoggedIn.value) {
  await navigateTo('/login')
}

import BookingTable from "../../components/admin/BookingTable.vue";

const user = useSupabaseUser()
const route = useRoute()
const supabase = useSupabaseClient()

const userId = computed(() => {
  return user.value.sub || user.value.meta_data.sub
})

const {data: guestProfile} = await supabase.from('guests')
  .select('id')
  .eq('profile_id', userId.value) // matching the logged in user's id
  .maybeSingle()

// get booking if view / edit
const {data: bookings, refresh} = await useAsyncData(`${route.params.id }-booking`, async () => {
  const {data,error} = await supabase
    .from('bookings_with_details')
    .select('*')
    .eq('guest_id', guestProfile.id)

  if(error || !data) {
    throw createError({
      status: 404,
      statusText: 'Booking ikke fundet',
      fatal: true
    })
  }

  return data
})
</script>
