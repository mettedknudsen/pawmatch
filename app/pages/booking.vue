<template>
  <div class="pawmatch-container lg:grid grid-cols-12 gap-4 max-lg:space-y-4">
    <div class="col-span-12">
        <div>
          <div></div><span v-if="pet">Vælg dyr</span><span v-else>Vælg dyr</span>
        </div>
    </div>
    <aside class="col-span-3">
      <div class="bg-white shadow-lg rounded-lg p-5 lg:py-10">
        <template v-if="route.query.dyr && pet">
          <h2 class="text-2xl text-bark-500 font-bold font-roboto mb-3">Dit valgte dyr</h2>
          <p class="text-neutral-500 mb-2 font-bold">{{pet.name}}</p>
          <p class="text-neutral-500 mb-10 capitalize">{{species[pet.species]}} <span class="px-1">-</span> {{gender[pet.gender]}}</p>
          <h2 class="text-2xl text-bark-500 font-bold font-roboto mb-3">Vælg mødetype</h2>
          <div>

          </div>
        </template>
        <template v-else>
          <h2 class="text-2xl text-bark-500 font-bold font-roboto mb-3">Standardbesøg</h2>
          <p class="text-neutral-500">Kom forbi og kig rundt.</p>
        </template>
       </div>
    </aside>
    <main class="col-span-9 bg-white shadow-lg rounded-lg py-10 lg:px-15">
      <h1 class="text-2xl text-bark-500 font-bold font-roboto mb-8 max-lg:px-5">Vælg dato og tid</h1>
      <client-only>
        <!-- calender -->
        <VDatePicker v-model="selectedDate" :attributes="attrs"
                     class="!w-full !max-w-unset !border-none [&_button]:only:!text-bark-900
                    [&_button]:[&:not(:only-child)]:bg-bark-300 [&_button]:[&:not(:only-child)]:!size-8 max-lg:[&_button]:[&:not(:only-child)]:!mx-4 max-lg:[&_button]:[&:not(:only-child)]:!size-10 [&_button]:[&:not(:only-child)]:hover:!bg-bark-500/30 [&_button]:[&:not(:only-child)]:hover:!text-white [&_button]:[&:not(:only-child)]:!rounded-full"
        >
          <template #day-content="{ day, attributes }">
            <div
              class="!w-10 lg:!w-15 !h-10 !flex !items-center !justify-center !rounded-lg mx-auto my-1.5 !text-bark-500/80"
              :class="{
                '!bg-creme !text-bark-900 hover:!bg-terrakotta/80 hover:!text-white !font-bold': attributes.some(a => a.key === 'available'),
                '!border !border-terrakotta [&_*]:!bg-transparent': attributes.some(a => a.key === 'today'),
                'opacity-75': attributes.some(a => a.key === 'disabled'),
                '!bg-terrakotta !text-white !font-bold': attributes.some(a => a.key === 'selected')
              }"
            >
              {{ day.day }}
            </div>
          </template>
        </VDatePicker>
      </client-only>
      <!-- timeslots-->
      <div v-if="selectedDate" class="max-lg:px-5 mb-7 lg:mb-10">
          <h3>Ledige tider <span class="px-1">-</span> {{ formattedDate(selectedDate) }}</h3>
        <div>

        </div>
      </div>
      <!-- receipt -->
      <template v-if="!selectedDate">
        <div class="bg-creme p-5 rounded-lg mb-7 lg:mb-10 text-bark-500/80 space-y-5 max-lg:mx-5">
          <div v-if="pet" class="flex items-center justify-between">
            <p>Dyr</p>
            <p class="font-bold">{{pet.name}} ({{species[pet.species]}})</p>
          </div>
          <div v-if="pet" class="flex items-center justify-between">
            <p>Mødetype</p>
            <p class="font-bold">{{pet.name}} ({{species[pet.species]}})</p>
          </div>
          <div v-if="selectedDate" class="flex items-center justify-between">
            <p>Dato</p>
            <p class="font-bold">{{formattedDate(selectedDate)}}</p>
          </div>
          <div v-if="pet" class="flex items-center justify-between">
            <p>Tidspunkt</p>
            <p class="font-bold">{{pet.name}} ({{species[pet.species]}})</p>
          </div>
        </div>
        <div class="px-5 flex items-center space-x-4">
          <Button type="button" class="hover:bg-terrakotta-hover">
            Bekræft booking
          </Button>
          <Button type="button" variant="plain" color="dark" class="hover:opacity-80">
              Annuller
          </Button>
        </div>

      </template>

    </main>
  </div>
</template>
<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'

const supabase = useSupabaseClient()
const route = useRoute()
const petId = computed(() => route.query.dyr)

const {appointmentType, species, gender} = useAnimalMetaData()
const {bookingDateTime} = useFormat()

const {data:pet, refresh} = await useAsyncData(`pet-${petId.value}`, async () => {
  if(!petId.value) return
  const {data,error} = await supabase
    .from('animals')
    .select('name, age_months, gender, species')
    .eq('id', petId.value)
    .single()
  if(error) throw error
  return data
})

// form state and ref values
const form = reactive({
  animal_id: petId.value  ?? null,
  timeslot_id: '',
  meeting_type: 'visit',
  notes: '',
  guest_name: '',
  guest_email: '',
  guest_phone: ''
})

const selectedDate = ref(<Date | null> null)


const loading = ref(false)
const error = ref('')
const success = ref(false)


// appointment/meeting types based on selected animal
const appointmentTypeBySpecies: Record<string, string[]> = {
  dog:['walk', 'visit', 'petting'],
  cat:['visit','petting'],
  rabbit:['visit', 'petting']
}

// which meeting types should be available based on animal's species
const availableAppointmentTypes = computed(() => {
  if(!pet.value.species) return {visit:'Standard'}

  const allowed = appointmentTypeBySpecies[pet.value.species] ?? ['visit', 'petting']

  // get the appointmentType key values filtered by allowed strings
  return Object.fromEntries(
    Object.entries(appointmentType).filter(([key]) => allowed.includes(key))
  )
})

// get the timeslots
watch([selectedDate], () => {
  form.timeslot_id = ''
} )

const {data: timeslots} = await useAsyncData('booking-timeslots', async () =>{
    if(!selectedDate.value) return []

    // start of selected date
    const start = Temporal.PlainDate.from(selectedDate.value).toZonedDateTime('Europe/Copenhagen').startOfDay().toInstant().toString()
    // start of the day after selected date
    const end = Temporal.PlainDate.from(selectedDate.value).toZonedDateTime('Europe/Copenhagen').add({days: 1}).startOfDay().toInstant().toString()

    const { data} = await supabase
      .from('timeslots')
      .select('*, bookings(count)')
      .gte('starts_at', start) // greater than (first minute of the day)
      .lt('starts_at', end) // less than (start of the next day)
      .order('starts_at')
    return data
  }, {watch: [selectedDate]}// update/watch when selected date changes !
)

const availableTimeslots = computed(() =>
  timeslots.value?.filter(t => {
    const booked = t.bookings?.[0]?.count ?? 0
    return booked < t.capacity  // our bookings(count) less that the timeslot capacity ?
  }) ?? []
)

      // coloring the timeslots based on availability //


const formattedDate = (date) => {
  if(!date) return null
  return date.toLocaleString('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const attrs = ref([
  {
    key: 'today',
    highlight: {
      color: 'green',
      fillMode: 'solid'
    },
    dates: new Date()
  }
])
</script>

