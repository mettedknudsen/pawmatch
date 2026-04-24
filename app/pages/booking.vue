<template>
  <div class="pawmatch-container lg:grid grid-cols-12 gap-4 max-lg:space-y-4 mb-10 lg:mb-20 min-h-[90vh] content-start">
          <!--  Reciept for booking  -->
    <main v-if="success" class="col-span-12 text-center py-5 lg:py-10">
      <section class="max-w-lg mx-auto py-5 lg:py-20 bg-white px-3 md:px-5">
        <div class="w-16 h-16 bg-salvie-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-salvie-900" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="text-2xl font-inter font-bold text-bark-900 mb-2">Booking bekræftet!</h1>
        <p class="mb-8  text-neutral-500">Vi glæder os til at se dig.</p>

        <div class="bg-creme/75 rounded-2xl p-3 md:p-5 text-left space-y-3 text-sm mb-8">
          <div v-if="pet" class="flex justify-between">
            <span class="text-neutral-600">Dyr</span>
            <span class="font-bold text-bark-900/80">{{ pet.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-600">Type</span>
            <span class="font-bold text-bark-900/80">{{ appointmentType[form.meeting_type] }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-600">Dato</span>
            <span class="font-bold text-bark-900/80">{{ formattedDate(selectedDate) }}</span>
          </div>
          <div v-if="selectedTimeslot" class="flex justify-between">
            <span class="text-neutral-600">Tidspunkt</span>
            <span class="font-bold text-bark-900/80">
            {{ bookingDateTime(selectedTimeslot.starts_at, selectedTimeslot.duration_minutes).time }}
          </span>
          </div>
          <div class="border-t border-bark-500/10 pt-3">
            <span class="text-neutral-600 mb-1 block">Dit navn</span>
            <p class="font-bold text-bark-500/80 text-xs">
            {{ isLoggedIn ? profile?.full_name : form.guest_full_name }}
          </p>
          </div>
          <div class="pt-3">
            <span class="text-neutral-600 mb-1 block">Dine kontaktoplysninger</span>
            <div class="font-bold text-bark-500/80 text-xs">
              <p>{{ isLoggedIn ? user?.email : form.guest_email }}</p>
              <p>{{ isLoggedIn && user?.phone ? user?.phone : form.guest_phone }}</p>
          </div>
          </div>
        </div>

        <div class="flex gap-3 justify-center">
          <Button to="/">Tilbage til forsiden</Button>
        </div>
      </section>
    </main>

    <!--  booking flow  -->
    <template v-else>
      <div class="col-span-12">
        <div class="font-inter md:text-xl flex items-center justify-center pt-5" v-if="petId && pet">
          <div class="flex items-center px-2 lg:px-5">
            <span :class="currentStep === 1 ? 'bg-terrakotta text-white' : 'bg-salvie-700/80 text-white'" class="size-5 md:size-8 flex items-center justify-center rounded-full font-bold">1</span>
            <span :class="currentStep === 1 ? 'text-bark-500/80 font-bold' : 'text-bark-500/50'" class="ml-2">Vælg dyr</span>
          </div>
          <div class="flex items-center px-2 lg:px-5">
            <span :class="currentStep === 2 ? 'bg-terrakotta text-white font-bold' : currentStep === 1 ? 'bg-bark-300 text-bark-900/50' : 'bg-salvie-900/50 text-white font-bold'" class="size-5 md:size-8 flex items-center justify-center rounded-full">2</span>
            <span :class="currentStep === 2 ? 'text-bark-500/80 font-bold' : 'text-bark-500/50'" class="ml-2">Vælg tid</span>
          </div>
          <div class="flex items-center px-2 lg:px-5">
            <span :class="currentStep === 3 ? 'bg-terrakotta text-white font-bold' : 'bg-bark-300 text-bark-900/50'"  class="size-5 md:size-8 flex items-center justify-center rounded-full">3</span>
            <span :class="currentStep === 3 ? 'font-bold text-bark-500/80' : 'text-bark-500/50'"  class="ml-2">Bekræft</span>
          </div>
        </div>
      </div>
    <aside class="col-span-4 xl:col-span-3 self-start">
      <div class="bg-white shadow-lg rounded-lg p-5 lg:py-10">
          <template v-if="petId && pet">
            <h2 class="text-2xl text-bark-500 font-bold font-inter mb-3">Dit valgte dyr</h2>
            <p class="text-bark-500/90 mb-2 font-bold">{{pet.name}}</p>
            <p class="text-bark-500/90 mb-10 capitalize">{{species[pet.species]}} <span class="px-1">-</span> {{gender[pet.gender]}}</p>
          </template>
          <div class="formatting text-bark-500/90">
            <h2 class="text-2xl text-bark-500 font-bold font-inter mb-3">Vælg besøgstype</h2>
            <p class="text-sm">
              Vi tilbyder 3 typer besøg
            </p>
            <ul class="text-xs">
              <li class="py-3"><span class="font-bold">Standard</span> <span class="px-0.5">-</span> Kom og kig rundt, og besøg dyret i dets bur.</li>
              <li class="py-3"><span class="font-bold">Kæletid</span> <span class="px-0.5">-</span> Guidet tid med dyret i vores aktivitetsrum eller i haven.</li>
              <li class="py-3"><span class="font-bold">Gåtur</span> <span class="px-0.5">-</span> Ved hunde tilbyder vi en guidet gåtur udenfor internatet.</li>
            </ul>
            <div class="flex max-md:flex-col lg:flex-col gap-2" v-if="petId">
              <button
                v-if="availableAppointmentTypes"
                v-for="(label, key) in availableAppointmentTypes"
                :key="key"
                type="button"
                class="flex-1 border rounded-xl py-3 text-sm font-medium transition-colors"
                :class="form.meeting_type === key ? 'bg-terrakotta/20 text-bark-500 border-terrakotta' : 'border-neutral-300 text-neutral-600 hover:border-terrakotta'"
                @click="form.meeting_type = key"
              >
                {{ label }} (30min)
              </button>
            </div>
            <template v-else>
              <div class="border rounded-xl py-3 text-sm font-medium text-center bg-terrakotta/20 text-bark-500 border-terrakotta">
                Standardbesøg (30min)
              </div>
              <div class="my-3">
                <p class="text-xs pb-3">For andre muligheder, vælg et dyr du gerne vil fokusere dit besøg på:</p>
                <Button to="/dyr">Se alle her</Button>
              </div>
            </template>
          </div>
       </div>
    </aside>
    <main class="col-span-8 xl:col-span-9 bg-white shadow-lg rounded-lg py-10 lg:px-15 mb-10" v-if="currentStep > 1">
      <h1 class="text-2xl text-bark-500 font-bold font-inter mb-8 max-lg:px-5">Vælg dato og tid</h1>
      <!-- Calendar  -->
      <client-only>
        <!-- calender -->
        <VDatePicker mode="date"  v-model.string="selectedDate" :masks="{ modelValue: 'YYYY-MM-DD' }" :attributes="attrs" :min-date="new Date()" locale="da-DK" :first-day-of-week="2"
                     class="!w-full !max-w-unset !border-none [&_button]:only:!text-bark-900
                    [&_button]:[&:not(:only-child)]:bg-bark-300 [&_button]:[&:not(:only-child)]:transition [&_button]:[&:not(:only-child)]:!size-8 max-lg:[&_button]:[&:not(:only-child)]:!mx-4 max-lg:[&_button]:[&:not(:only-child)]:!size-10 [&_button]:[&:not(:only-child)]:hover:!bg-bark-500/30 [&_button]:[&:not(:only-child)]:hover:!text-white [&_button]:[&:not(:only-child)]:!rounded-full"
        >
          <template #day-content="{ day, attributes, dayEvents }">
            <div
              v-on="dayEvents"
              class="!w-10 lg:!w-15 !h-10 !flex !items-center !justify-center !rounded-lg mx-auto my-1.5 !text-bark-500/80"
              :class="{
                '!bg-creme/75 !text-bark-500/40 hover:!bg-terrakotta/80 hover:!text-white !font-bold transition cursor-pointer': attributes.some(a => a.key === 'available'),
                '!border !border-terrakotta [&_*]:!bg-transparent': attributes.some(a => a.key === 'today'),
                'text-bark-900/10 bg-neutral-200/25 opacity-50 cursor-not-allowed pointer-events-none': attributes.some(a => a.key === 'disabled'),
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
        <h3 class="mb-5">Ledige tider <span class="px-1">-</span> {{ formattedDate(selectedDate) }}</h3>
        <div>
          <div v-if="availableTimeslots.length === 0" class="text-sm py-4 text-neutral-400 ">
            Ingen ledige tider på denne dato — vælg en anden dag
          </div>
          <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <button
              v-for="slot in availableTimeslots"
              :key="slot.id"
              type="button"
              class="p-3 border text-sm font-medium rounded-xl transition "
              :class="slotColorClass(slot)"
              @click="form.timeslot_id = slot.id"
            >
              {{Temporal.Instant.from(slot.starts_at).toZonedDateTimeISO('Europe/Copenhagen').toLocaleString('da-DK', { hour: '2-digit', minute: '2-digit' })}}
              <span class="block text-xs mt-0.5 opacity-70">
                {{slot.capacity - (slot.bookings?.[0]?.count ?? 0)}}
                {{slot.capacity - (slot.bookings?.[0]?.count ?? 0) === 1 ? 'ledig' : 'ledige'}}
              </span>
            </button>
          </div>
        </div>
      </div>

      <template v-if="selectedDate && form.timeslot_id && currentStep > 2">
          <!-- get user / guest info -->
        <section class="p-5 mb-3 lg:mb-5">
          <h3 class="font-bold text-bark-500 mb-3">Dine kontaktinformationer</h3>
          <template v-if="isLoggedIn">
            <p class="text-neutral-500" v-if="profile">Navn: {{profile.full_name}}</p>
            <p class="text-neutral-500" v-if="user.email">Email: {{user.email}}</p>
            <p class="text-neutral-500" v-if="user.phone">Tlf: {{user.phone}}</p>
          </template>
          <template v-else-if="showLoginForm">
            <form class="space-y-3" @submit.prevent="handleLogin">
              <CInput v-model="loginEmail" label="Email" type="email"width="full" :required="true" />
              <CInput v-model="loginPassword" label="Adgangskode"  type="password" width="full" :required="true" />
              <p v-if="loginError" class="text-sm text-rust-900">{{ loginError }}</p>
              <div class="flex gap-2 items-center">
                <Button type="submit" :loading="loginLoading" size="sm">Log ind</Button>
                <Button type="button" variant="plain" color="dark" size="sm" class="!px-0" @click="showLoginForm = false">
                  Annuller
                </Button>
              </div>
            </form>
            <p class="text-xs text-neutral-400 mt-2">
              Ingen konto?
              <NuxtLink to="/register" class="text-terrakotta hover:underline">Opret dig her</NuxtLink>
            </p>
          </template>
          <template v-else>
            <div class="input flex flex-col md:grid grid-cols-2 gap-4">
              <CInput v-model="form.guest_full_name" width="full" type="text" :required="true" label="Dit fulde navn"/>
              <CInput v-model="form.guest_email" width="half" type="email" label="Email" :required="true"/>
              <CInput v-model="form.guest_phone" width="half" type="tel" label="Telefon" :required="true"/>
            </div>
            <p class="text-xs text-neutral-400 mt-2">
              Har du en konto?
              <Button variant="plain" type="button" class="!px-0 mt-1 hover:underline" @click="showLoginForm = true">Log ind her</Button>
            </p>
          </template>
        </section>

        <div class="mb-5 mx-5 input">
          <h3 class="font-bold text-bark-500 mb-4">Bemærkninger <span class="text-neutral-400 font-normal text-sm">(valgfrit)</span></h3>
          <textarea
            v-model="form.notes"
            rows="3"
            class=" w-full accent"
            placeholder="Fx særlige ønsker eller spørgsmål..."
          />
        </div>
        <p v-if="error" class="text-xs text-rust-900 col-span-2 p-2 bg-rust-300/50 rounded-lg border mx-5 mb-5">{{error}}</p>
        <div class="px-5 flex items-center space-x-4">
          <Button type="button" class="hover:bg-terrakotta-hover" :loading="loading" @click="save">
            Bekræft booking
          </Button>
          <Button :to="pet ? `/dyr/${petId}` :'/'" variant="plain" color="dark" class="hover:opacity-80">
              Annuller
          </Button>
        </div>

      </template>

    </main>
    </template>
  </div>
</template>
<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import CInput from "../components/CInput.vue";

const supabase = useSupabaseClient()
const route = useRoute()

const { user, profile, isLoggedIn } = useAuth()
const {appointmentType, species, gender} = useAnimalMetaData()
const {bookingDateTime} = useFormat()

const petId = computed(() => route.query.dyr as string | undefined)

const {data:pet} = await useAsyncData(`pet-${petId.value}`, async () => {
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
  animal_id: petId.value ?? null,
  timeslot_id: '',
  meeting_type: petId.value ? '' : 'visit',
  notes: '',
  guest_full_name: '',
  guest_email: '',
  guest_phone: ''
})

// login form info
const showLoginForm = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const loginLoading = ref(false)

async function handleLogin() {
  loginLoading.value = true
  loginError.value = ''
  try{
    const {error} = await supabase.auth.signInWithPassword({
      email: loginEmail.value,
      password:loginPassword.value
    })
    if(error) throw error
    showLoginForm.value = false
  } catch (e:any){
    loginError.value = 'Forkert email eller adgangskode'
  } finally {
    loginLoading.value = false
  }
}

const currentStep = computed(() => {
  if (!form.meeting_type) return 1
  if (!selectedDate.value || !form.timeslot_id) return 2
  return 3
})
const selectedDate = ref(<string | null> null)
const selectedTimeslot = computed(() =>
  timeslots.value?.find(t => t.id === form.timeslot_id)
)

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

//---- get the timeslots where the chosen animal is booked ----//
const {data:animalBookedSlots, refresh: animalTimeslotRefresh} = await useAsyncData(`animal-booked-${form.animal_id}`, async() => {
  if(!form.animal_id) return []
  const {data} = await supabase.from('bookings')
    .select('timeslot_id')
    .eq('animal_id', form.animal_id)
    .neq('status', 'cancelled')
  return data?.map(b =>b.timeslot_id) ?? []

},{watch: [() => form.animal_id]}
)


//---- get the timeslots for date ----//
const {data: timeslots, refresh: timeslotRefresh} = await useAsyncData('booking-timeslots', async () =>{
    if(!selectedDate.value) return []
    const dateZoned = Temporal.PlainDate.from(selectedDate.value).toZonedDateTime('Europe/Copenhagen')

    // We need to check if the timeslots have already passed
    const now = Temporal.Now.instant()

    let startOfSelectedDay = dateZoned.startOfDay().toInstant()

    // then the time of the day
    if(Temporal.Instant.compare(now, startOfSelectedDay) > 0){
      startOfSelectedDay = now
    }

    // start of selected day or the current time, if that is after
    const start = startOfSelectedDay.toString()

    // start of the day after selected date
    const end = Temporal.PlainDate.from(selectedDate.value).toZonedDateTime('Europe/Copenhagen').add({days: 1}).startOfDay().toInstant().toString()

    const { data} = await supabase
      .from('timeslots')
      .select('*, bookings(count)')
      .gte('starts_at', start) // greater than (first minute of the day)
      .lt('starts_at', end) // less than (start of the next day)
      .order('starts_at')
    return data
  },{
    watch: [selectedDate], // update/watch when selected date changes !
    server: false, // only in browser
    lazy: true, // no black ssr
  }
)
// reset timeslot selection if date changes
watch([selectedDate], () => {
  form.timeslot_id = ''
} )

const availableTimeslots = computed(() =>
  timeslots.value?.filter(t => {
    // first check the capacity - is the amount booked reach the capacity
    const booked = t.bookings?.[0]?.count ?? 0
    if(booked >= t.capacity) return false // if at capacity return false

    // then check if the animal is booked at this timeslot
    return !(form.animal_id && animalBookedSlots.value?.includes(t.id));

  }) ?? []
)

// coloring the timeslots based on availability //
function slotColorClass(slot: any) {
  const remaining = slot.capacity - (slot.bookings?.[0]?.count ?? 0)
  if (form.timeslot_id === slot.id) return 'bg-terrakotta text-white !font-bold border-terrakotta'
  if (remaining <= 1) return 'border-rust-500 text-rust-900 bg-rust-300/30'
  if (remaining === 2) return 'border-amber-400 text-amber-700 bg-amber-50'
  return 'border-neutral-200 text-bark-700 hover:border-terrakotta'
}


const { data: availableDates } = await useAsyncData('available-dates', async () => {
  const { data } = await supabase
    .from('timeslots')
    .select('starts_at, bookings(count), capacity')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at')

  const dates = new Set<string>()
  data?.forEach(slot => {
    const booked = slot.bookings?.[0]?.count ?? 0
    if (booked < slot.capacity) {
      dates.add(slot.starts_at.split('T')[0])
    }
  })
  return Array.from(dates)
}, {
  server: false,
  lazy:   true,
})

const formattedDate = (dateStr) => {
  if(!dateStr) return null

// since we changed the selected date to a string, we need to change it to a plaindate to format it with temporal
  const date = Temporal.PlainDate.from(dateStr)

  return date.toLocaleString('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}
// calendar attributes
const attrs = computed(() => [
  {
    key: 'today',
    dates: new Date()
  },
  {
    key: 'available',
    dates: availableDates.value?.map(d => new Date(d)) ?? [],
  },
  {
    key: 'disabled',
    dates: {
      start: new Date(2025, 10, 7),
      repeat: {
        every: [1, 'weeks'],
        weekdays: [1],
      },
    }
  },
  {
    key: 'selected',
    dates: selectedDate.value ? [selectedDate.value] : [],
  }
])

function validateGuest(){
  if(isLoggedIn.value) return true
  if(!form.guest_full_name) {
    error.value = "Indtast dit navn";
    return false
  }
  if(!form.guest_email) {
    error.value = "Indtast din email";
    return false
  }
  if(!form.guest_phone) {
    error.value = "Indtast dit telefonnummer";
    return false
  }
  return true
}

// lastly - save the booking on submit
async function save() {
  // check guest form/login | sets errors if invalid
  if (!validateGuest()) return

  loading.value = true
  error.value = ''

  try{
    const makeBooking = await $fetch('/api/create-booking', {
      method: 'POST',
      body: {
        form: form,
        user: isLoggedIn.value ? user.value : null,
        profile: profile.value ?? null
      }
    })
    success.value = true
  }
  catch (e: any) {
    error.value = e.message ?? 'Der skete en fejl, prøv igen'
  }
  finally {
    if (success.value) {
      // refresh data for timeslots after successful booking - since else it's cached - in case they book again - though unlikely.
      await Promise.all([
        animalTimeslotRefresh(),
        timeslotRefresh()
      ])
    }
    loading.value = false
  }
}
</script>

