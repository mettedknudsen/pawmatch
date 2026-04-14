<template>
  <section class="max-w-2xl">
    <h1 class="text-2xl mb-8 text-bark-900 font-bold">
      Opret booking
    </h1>

    <form class="space-y-6 bg-white rounded-2xl border border-neutral-200 p-6" @submit.prevent="save()">

      <!-- GUEST -->
        <h2 class="text-sm uppercase font-medium text-neutral-500">Gæsteoprettelse</h2>
        <div class="grid grid-cols-2 gap-4">
          <CInput v-model="form.guest_full_name" width="full" type="text" :required="true" label="Fulde navn"/>
          <CInput v-model="form.guest_email" width="half" type="email" label="Email"/>
          <CInput v-model="form.guest_phone" width="half" type="tel" label="Telefon"/>



        <!-- BOOKING -->
        <h2 class="text-sm uppercase font-medium text-neutral-500 col-span-2">Bookingdetaljer</h2>

        <!-- SELECT ANIMAL -->
        <div class="input col-span-2 md:col-span-1">
          <label>Dyr</label>
          <select v-model="form.animal_id" required :size="animals.length + 1" class="max-h-[300px]">
            <option :value="null">Generelt besøg - intet dyr</option>
            <option v-for="a in animals" :key="a.id" :value="a.id">
              {{ a.name }} ({{species[a.species] }})
            </option>
          </select>
        </div>

        <div class="input col-span-2 md:col-span-1">
          <label class="block text-sm font-medium text-bark-700 mb-2">Mødetype<span class="text-rust-900 ml-1">*</span></label>
          <div class="flex md:flex-col gap-2">
            <button
              v-for="(label, key) in availableAppointmentTypes"
              :key="key"
              type="button"
              class="flex-1 border rounded-xl py-3 text-sm font-medium transition-colors"
              :class="form.meeting_type === key ? 'bg-terrakotta/20 text-bark-500 border-terrakotta' : 'border-neutral-300 text-neutral-600 hover:border-terrakotta'"
              @click="form.meeting_type = key"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <!-- DATE-->
        <CInput
          v-model="selectedDate"
          width="full"
          type="date"
          label="Dato"
          :required="true"
          :min="new Date().toISOString().split('T')[0]"
        />

        <!-- TIMESLOT -->
        <div v-if="selectedDate" class="col-span-2">
          <label class="block text-bark-700 font-medium mb-2 text-sm">Tidspunkt<span class="text-rust-900 ml-1 text-lg">*</span></label>
          <div v-if="availableTimeslots.length === 0" class="text-neutral-400 text-sm ">
            Ingen ledige tider på denne dato
          </div>
          <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              v-for="slot in availableTimeslots"
              :key="slot.id"
              type="button"
              class="p-2 border rounded-lg transition-colors text-sm"
              :class="form.timeslot_id === slot.id ? 'bg-terrakotta text-white border-terrakotta' : 'border-neutral-300 hover:border-terrakotta'"
              @click="form.timeslot_id = slot.id"
            >
              {{ Temporal.Instant.from(slot.starts_at)
              .toZonedDateTimeISO('Europe/Copenhagen')
              .toLocaleString('da-DK', { hour: '2-digit', minute: '2-digit' }) }}

            </button>
          </div>
        </div>

      <!-- NOTES -->
      <div class="input col-span-2">
        <label>Noter</label>
        <textarea v-model="form.notes" rows="3" placeholder="Fx særlige ønsker eller bemærkninger" />
      </div>

      <p v-if="error" class="text-sm text-rust-900 col-span-2 p-2 bg-rust-300/50 rounded-lg border">{{error}}</p>

      <div class="flex gap-3 col-span-2">
        <Button type="submit" :loading="loading">
          Opret booking
        </Button>
        <Button type="button" variant="bordered" color="dark" @click="navigateTo('/admin/bookinger')">
          Annuller
        </Button>
      </div>
        </div>
    </form>
  </section>
</template>
<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import CInput from "../../../components/CInput.vue";

definePageMeta({layout: 'admin'})

const supabase = useSupabaseClient()

const { appointmentType, species } = useAnimalMetaData()


const form = reactive({
  guest_full_name: '',
  guest_email: '',
  guest_phone: '',
  animal_name:'',
  animal_id: null,
  timeslot_id: '',
  meeting_type: 'visit',
  notes:'',
  status: 'confirmed',
})

const selectedDate = ref('')

// Reset timeslot if selectedDate is changed
watch([selectedDate], () => {
  form.timeslot_id = ''
} )

// Animals (for the select)
const { data: animals } = await useAsyncData('admin-animals-select', async () => {
  const { data } = await supabase
    .from('animals')
    .select('id, name, species')
    .eq('status', 'available')
    .order('name')
  return data
})

const {data: timeslots} = await useAsyncData('admin-timeslots', async () =>{
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
    return booked < t.capacity
  }) ?? []
)


const error = ref('')
const loading = ref(false)
async function save(){
  // validate
  if (!form.timeslot_id) {
    error.value = 'Vælg et tidspunkt'
    return
  }
  if(!form.meeting_type) {
    error.value = 'Vælg en mødetype'
    return
  }
  if (!form.guest_full_name) {
    error.value = 'Indtast gæstens navn'
    return
  }

  loading.value = true
  error.value = ''

  try{
      // add guest user
      const {data:guest, error:guestError} = await supabase
        .from('guests')
        .insert({
          full_name: form.guest_full_name,
          email: form.guest_email || null,
          phone: form.guest_phone || null
        })
        .select('id')
        .single()

      if(guestError) throw guestError

      // then add booking
      const {error: bookingError} = await supabase.from('bookings')
        .insert({
          guest_id: guest.id,
          animal_id: form.animal_id || null,
          timeslot_id: form.timeslot_id,
          meeting_type: form.meeting_type || 'visit',
          notes: form.notes || null,
          status: 'confirmed'
        })

      if(bookingError) throw bookingError

    navigateTo('/admin/bookinger')

    } catch (e:any) {
    error.value = e.message ?? 'Der skete en fejl, prøv igen.'
  } finally {
    loading.value = false
  }
}



const appointmentTypeBySpecies: Record<string, string[]> = {
  dog:['walk', 'visit', 'petting'],
  cat:['visit', 'petting'],
  rabbit:['visit', 'petting']
}

const selectedAnimal = computed(() =>
  animals.value?.find(a => a.id === form.animal_id)
)

// which meeting types should be available based on animal's species
const availableAppointmentTypes = computed(() => {
  if(!selectedAnimal.value) return {visit:'Standard'}

  const allowed = appointmentTypeBySpecies[selectedAnimal.value.species] ?? ['visit', 'petting']

  // get the appointmentType key values filtered by allowed strings
  return Object.fromEntries(
    Object.entries(appointmentType).filter(([key]) => allowed.includes(key))
  )
})

// now watch for changes in selectedAnimal to update appointmentTypes
watch(selectedAnimal, (newAnimal) =>{
  if(!newAnimal) {
    form.meeting_type = 'visit'
    return
  }
  const allowed = appointmentTypeBySpecies[selectedAnimal.value?.species ?? 'dog']
  if (!allowed.includes(form.meeting_type)) {
    form.meeting_type = 'visit'
  }
}, { immediate: true })

</script>
