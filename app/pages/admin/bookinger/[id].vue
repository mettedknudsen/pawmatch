<template>
<template v-if="booking">
    <div class="md:flex items-center justify-between">
      <section>
        <h1 class="text-2xl mb-2 text-bark-900 font-bold">
          Booking
        </h1>
        <p class="text-neutral-400 mb-8 text-sm font-roboto">{{ booking.id }}</p>
      </section>
      <div class="flex items-center gap-2 max-md:mb-5">
        <Button v-if="booking.status === 'confirmed'" variant="full" color="alert" :loading="loading" @click="cancelBooking">
          Aflys booking
        </Button>
        <div v-else class="text-rust-900 px-3 py-1.5 text-sm flex items-center gap-2">
          <WarningSvg />
          <span>Booking er aflyst</span>
        </div>
        <Button variant="bordered" color="dark" to="/admin/bookinger">
          Tilbage
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <article class="col-span-2 md:col-span-1 bg-white rounded-lg border border-neutral-200 p-6">
        <h3 class="uppercase text-neutral-400 text-sm font-roboto mb-1">tidspunkt</h3>
        <p class="text-lg text-bark-900 font-medium">{{ date }}</p>
        <p class="text-neutral-500 mt-1">{{ time }}</p>
        <div class="mt-3 flex items-center pt-3 gap-2">
          <span class="tag bg-sand text-bark-500" v-if="booking.meeting_type">{{ appointmentType[booking.meeting_type] }}</span>
          <span class="text-neutral-400 text-sm">{{ booking.duration_minutes }} min</span>
        </div>
      </article>

      <article class="col-span-2 md:col-span-1 bg-white rounded-lg border border-neutral-200 p-6">
        <h3 class="uppercase text-neutral-400 text-sm font-roboto mb-1">gæst</h3>
        <p class="text-lg font-medium text-bark-900">{{ booking.user_name }}</p>
        <p class="text-sm text-neutral-500 mt-1" v-if="booking.user_email">Email: <a class="hover:text-terrakotta" :href="`mailto:${booking.user_email}`">{{ booking.user_email }}</a></p>
        <p class="text-sm text-neutral-500 mt-1" v-if="booking.user_phone">Telefon: <a class="hover:text-terrakotta" :href="`tel:${booking.user_phone}`">{{ booking.user_phone }}</a></p>
      </article>

      <article class="col-span-2 md:col-span-1 bg-white rounded-lg border border-neutral-200 p-6" v-if="booking.animal_id">
        <h3 class="uppercase text-neutral-400 text-sm font-roboto mb-1">dyr</h3>
        <NuxtLink :to="`/admin/dyr/${booking.animal_id}`" class="text-lg font-medium text-bark-900 hover:text-terrakotta">{{ booking.animal_name }}</NuxtLink>
        <p class="text-sm text-neutral-500 mt-1">{{species[booking.animal_species]}}</p>

        <div v-if="booking.animal_cage" class="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2">
          <span class="text-neutral-600">Er lokaliseret i <strong>{{ booking.animal_cage}}</strong></span>
        </div>
      </article>
      <article class="col-span-2 md:col-span-1 bg-white rounded-lg border border-neutral-200 p-6">
        <h3 class="uppercase text-neutral-400 text-sm font-roboto mb-1">noter</h3>
        <div class="input">
          <textarea v-model="notes" rows="4" placeholder="Fx særlige ønsker eller bemærkninger" :disabled="booking.status === 'cancelled'" />
        </div>
        <p v-if="error" class="text-sm text-rust-700 mt-2">{{ error }}</p>
        <Button
          v-if="booking.status !== 'cancelled'"
          type="button"
          variant="full"
          color="primary"
          size="sm"
          class="mt-3 hover:bg-terrakotta-hover"
          :loading="loading"
          @click="save"
        >
          Gem noter
        </Button>
      </article>
    </div>

    <p class="text-neutral-400 mt-6 text-xs">
      Oprettet {{ bookingDateTime(booking.created_at, 0).date }}
    </p>
</template>
  <div v-else class="h-80 flex flex-col items-center justify-center space-y-4">
  <p>Ingen booking fundet.</p>
    <Button to="/admin/bookinger">Gå tilbage</Button>
  </div>
</template>

<script setup lang="ts">
import {useFormat} from "../../../composables/useFormat";
import WarningSvg from '~/assets/images/icons/warning.svg?component'

definePageMeta({layout: 'admin'})

const route = useRoute()
const supabase = useSupabaseClient()

const booking_id = <string> route.params.id

const { appointmentType, species } = useAnimalMetaData()
const { bookingDateTime} = useFormat()

// get booking if view / edit
const {data: booking, refresh} = await useAsyncData(`${route.params.id }-booking`, async () => {
  const {data,error} = await supabase
    .from('bookings_with_details')
    .select('*')
    .eq('id', booking_id)
    .single()

  if(error || !data) {
    throw createError({
      status: 404,
      statusText: 'Booking ikke fundet',
      fatal: true
    })
  }

  return data
})

const notes = ref(booking.value?.notes ?? '')
const loading = ref(false)
const error = ref('')


async function save(){
  loading.value = true
  error.value = ''
  try{
    //  edit booking
    const {error: err} = await supabase
      .from('bookings')
      .update({
        notes: notes.value || null
      })
      .eq('id', booking_id) // booking id from slug

    if (err) throw err
    refresh()
  } catch (e:any) {
    error.value = e.message ?? 'Der skete en fejl, prøv igen.'
  } finally {
    loading.value = false
  }
}

async function cancelBooking(){
  if(!confirm('Er du sikker på du vil aflyse denne booking?')) return
  loading.value = true

  try{
    const { error: err} = await supabase
      .from('bookings')
      .update({status: 'cancelled'})
      .eq('id', route.params.id as string)
    if(err) throw error
    refresh()

  } finally {
    loading.value = false
  }
}
const { date, time } = computed(() =>
  booking.value ? bookingDateTime(booking.value.starts_at, booking.value.duration_minutes) : { date: '', time: '' }
).value
</script>
