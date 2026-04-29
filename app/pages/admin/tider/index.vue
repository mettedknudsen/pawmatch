<template>
  <section class="max-w-6xl space-y-6 mb-8">
    <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-bark-900 font-inter">Tilføj tider</h1>
      <Button to="/admin" size="sm">Gå tilbage</Button>
    </div>
    <!-- add timeslots to a month - supabase function -->
    <div class="bg-white rounded-2xl border border-neutral-200 p-3 lg:p-6">
      <p class="text-neutral-500 text-sm mb-1">Vælg måned/år og opret tider til booking</p>
      <p class="text-neutral-500 text-sm mb-1"><strong>man-tors</strong>: 10-17</p>
      <p class="text-neutral-500 text-sm mb-3"><strong>lør</strong>: 10-15</p>
      <div class="flex items-center flex-wrap gap-3">
        <USelect :items="monthSelect" v-model="form.month" class="w-32" />
        <UInput type="number" :min="thisYear" v-model="form.year" class="w-32"/>
        <Button @click="addTimeslotsByMonth(form.month, form.year)" :loading="loading">Opret</Button>
        <p v-if="success" class="text-xs text-salvie-900 flex items-center"><ConfirmedSvg/> <span class="ml-1">Færdigt</span></p>
      </div>
    </div>
    <!-- optionally add exceptions for opening hours -->
    <article class="bg-white rounded-xl p-3 lg:p-6 flex flex-wrap items-start gap-3">
      <div class="w-full">
        <p class="bg-rust-300 text-rust-900 text-sm rounded-lg py-1 px-2 mb-5 border">
          <strong>Disclaimer:</strong> Denne del blev ikke funktionel (!)
        </p>
        <div class="items-center flex justify-between">
          <div>
            <h2 class="font-bold mb-4 text-sm font-inter text-bark-500 w-full">Undtagelser</h2>
            <p class="mb-4 text-xs text-neutral-500">Vælg dage hvor der skal ændres åbningstider.</p>
          </div>
          <Button v-if="exceptions.length" size="sm">Gem undtagelser</Button>
        </div>

      </div>

      <!--exception dates-->
      <UCalendar v-model="selectedDays"
                 :year-controls="false" multiple
                 :weekStartsOn="1" locale="da-DK"
                 :min-value="minDate"
                 :default-placeholder="minDate"
                 :is-date-unavailable="(date) =>
                 !availableSlotsSet.has(`${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
                 )"
                 :ui="{cell: 'my-1'}"
                 class="rounded-2xl lg:border border-neutral-200 lg:p-6 [&_*]:aria-disabled:hover:bg-transparent
                 [&_*]:aria-disabled:opacity-70 [&_*]:aria-[disabled=false]:bg-sand/30 [&_*]:aria-[disabled=false]:rounded-full w-full lg:flex-1 max-lg:mb-5"/>

      <!--exception details-->
      <div class="w-full lg:flex-1">
        <div v-if="exceptions.length > 0" class="bg-white rounded-2xl lg:border border-neutral-200 lg:p-6">
          <div class="space-y-3">
            <div v-for="(ex, i) in exceptions" :key="i" class="p-3 bg-neutral-100 rounded-xl space-y-3">
              <div class="flex items-center justify-between gap-5">
                <span class="text-sm font-medium text-bark-900 min-w-28">
                  {{Temporal.PlainDate.from(ex.date).toLocaleString('da-DK',{ weekday: 'short', day: 'numeric', month: 'short' })}}
                </span>
                <button class="text-rust-700 hover:text-rust-900 text-sm" @click="removeException(i)">Fjern</Button>
              </div>
              <div class="flex items-center flex-wrap justify-between gap-5 ">
                <USelect v-model="ex.type" class="w-32" :items="[
                    { label: 'Lukket', value: 'closed' },
                    { label: 'Tilpasset', value: 'custom' }
                  ]"
                />
                <div>
                  <template v-if="ex.type === 'custom'">
                    <USelect v-model="ex.open"
                             :items="hourSelectItems"
                             default-value=""
                             class="w-32"/>
                    <span class="text-neutral-400 text-sm px-3">–</span>
                    <USelect v-model="ex.close"
                             :items="hourSelectItems"
                             class="w-32"/>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

  </section>

</template>
<script setup lang="ts">
import {Temporal} from 'temporal-polyfill'

import ConfirmedSvg from '~/assets/images/icons/confirmed.svg?component'
import {CalendarDate, today, getLocalTimeZone} from '@internationalized/date'

const supabase = useSupabaseClient()

definePageMeta({layout: 'admin'})

const thisYear = Temporal.Now.plainDateTimeISO('Europe/Copenhagen').year
const thisMonth = Temporal.Now.plainDateTimeISO('Europe/Copenhagen').month
const monthSelect = [
  {
    value: 1,
    label: 'Januar',
  },
  {
    value: 2,
    label: 'Februar',
  },
  {
    value: 3,
    label: 'Marts',
  },
  {
    value: 4,
    label: 'April',
  },
  {
    value: 5,
    label: 'Maj',
  },
  {
    value: 6,
    label: 'Juni',
  },
  {
    value: 7,
    label: 'Juli',
  },
  {
    value: 8,
    label: 'August',
  },
  {
    value: 9,
    label: 'September',
  },
  {
    value: 10,
    label: 'Oktober',
  },
  {
    value: 11,
    label: 'November',
  },
  {
    value: 12,
    label: 'December',
  },
]
const form = reactive({
  month: thisMonth || 1,
  year: thisYear || 2026
})

const {data: timeslots ,refresh} = await useAsyncData('admin-adjust-timeslots', async () =>{

    // We need to check if the timeslots have already passed
    const now = Temporal.Now.plainDateTimeISO('Europe/Copenhagen').toString()

    const {data} = await supabase
      .from('timeslots')
      .select('id, starts_at, capacity, bookings(count)')
      .gte('starts_at', now)// timeslots past than time now
      .order('starts_at')
    return data
  }
)

const availableSlotsSet = computed(() =>{
  if (!timeslots.value) return new Set<string>()
  return new Set(
    timeslots.value.map(slot => slot.starts_at.slice(0, 10))
  )
})


const exceptions = ref<{
  date: string
  type: 'closed' | 'custom'
  open?: number
  close?: number
  label?: string
}[]>([])

const selectedDays = ref<CalendarDate[]>([])

// make exceptions when new days are selected
watch(selectedDays, (days) => {
  // console.log(days)
  // mapping the days object array to make string array
  // structure the days objects to YYYY-MM-DD format - using padStart string method to add 0 to month/day 1-9
  const selectedStrings = days ? days.map(d => `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`) : []
  // console.log(selectedStrings)

  // remove exceptions that's not found in our string array
  exceptions.value = exceptions.value.filter(e => selectedStrings.includes(e.date))

  // add new exceptions from each string
  selectedStrings.forEach(dateStr => {
    // check if they're not in there already
    if (!exceptions.value.find(e => e.date === dateStr)) {
      // pushing default values
      exceptions.value.push({
        date: dateStr,
        type: 'closed',
        open: 10,
        close: 15,
        label: ''
      })
    }
  })
})

// calendar min date value (CalendarDate object!)
const minDate = today(getLocalTimeZone())

function removeException(i: number) {
  exceptions.value.splice(i, 1)
  selectedDays.value.splice(i, 1)
}

const loading = ref(false)
const success = ref(false)

async function addTimeslotsByMonth(month: number, year: number) {
  loading.value = true
  success.value = false

  try {
    // we need a string format 'yyyy-mm-dd' for the supabase function - changing the number values
    const formattedMonth = String(month).padStart(2, '0')
    const targetMonth = `${year}-${formattedMonth}-01`

    const { error } = await supabase.rpc('generate_slots_for_month', {
      target_month: targetMonth
    })

    if (error) {
      console.error(error)
      throw error
    } else {
      refresh()
    success.value = true
    }
  } finally {
    loading.value = false
  }
}

const hourSelectItems = [
  {
    value: 8,
    label: '8:00'
  },
  {
    value: 9,
    label: '9:00'
  },
  {
    value: 10,
    label: '10:00'
  },
  {
    value: 11,
    label: '11:00'
  },
  {
    value: 12,
    label: '12:00'
  },
  {
    value: 13,
    label: '13:00'
  },
  {
    value: 14,
    label: '14:00'
  },
  {
    value: 15,
    label: '15:00'
  },
  {
    value: 16,
    label: '16:00'
  },
  {
    value: 17,
    label: '17:00'
  },
  {
    value: 18,
    label: '18:00'
  },
  {
    value: 19,
    label: '19:00'
  },
]
</script>
