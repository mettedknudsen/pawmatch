<template>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-bark-900">Dyr</h1>
        <Button :icon="PlusSvg" to="/admin/dyr/opret" size="sm">Tilføj dyr</Button>
    </div>

    <div class="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <table class="w-full text-sm">

        <thead class="bg-neutral-50 border-b border-neutral-200">
        <tr>
          <th class="text-left text-bark-500  px-4 py-3 font-medium">Detaljer</th>
          <th class="text-left text-bark-500  px-4 py-3 max-md:hidden font-medium">Type</th>
          <th class="text-left text-bark-500  px-4 py-3 max-sm:hidden font-medium">Status</th>
          <th class="text-left text-bark-500  px-4 py-3 max-md:hidden font-medium">Bookinger</th>
          <th class="px-4 py-3"></th>
        </tr>
        </thead>


        <tbody class="divide-y divide-neutral-100">
        <tr v-for="animal in animals" :key="animal.id">
          <td class="px-4 py-3 space-y-3">
            <NuxtLink class="hover:text-terrakotta text-bark-900" :to="`/admin/dyr/${animal.id}`">{{ animal.name }}</NuxtLink>
            <p class="text-neutral-500 text-xs" v-if="animal.cage">Bur: {{animal.cage}}</p>
            <div class="md:hidden text-neutral-500 text-xs" v-if="animal.species">
              {{ species[animal.species]}}
            </div>
             <span v-if="animal.status" :class="status[animal.status].class" class="tag block sm:hidden text-center !max-w-32">
               {{status[animal.status].label}}
             </span>

            <div class="mt-5 text-neutral-600 md:hidden">
              <p class="font-bold" v-if="animal.total_bookings">Antal: {{animal.total_bookings}}</p>
              <p v-else>Ingen bookinger</p>
              <p v-if="animal.next_booking_at" class="text-xs">Næste booking: <br> {{bookingDateTime(animal.next_booking_at, 30).dateShort}} <br> {{bookingDateTime(animal.next_booking_at, 30).time}} </p>
            </div>
          </td>
          <td class="px-4 py-3 text-neutral-600 max-md:hidden" v-if="animal.species"> {{ species[animal.species]}}</td>
          <td class="px-4 py-3 max-sm:hidden">
            <span v-if="animal.status" :class="status[animal.status].class" class="tag max-w-26 flex justify-center">
              {{status[animal.status].label}}
            </span>
          </td>
          <td class="px-4 py-3 text-neutral-600 max-md:hidden">
            <p class="font-bold" v-if="animal.total_bookings">Antal: {{animal.total_bookings}}</p>
            <p v-else>Ingen bookinger</p>
            <p v-if="animal.next_booking_at" class="text-xs">Næste booking: <br> {{bookingDateTime(animal.next_booking_at, 30).dateShort}} <br> {{bookingDateTime(animal.next_booking_at, 30).time}} </p>
          </td>
          <td class="px-4 py-3 flex gap-2 justify-end">
            <Button variant="bordered" color="dark" :to="`/admin/dyr/${animal.id}`" size="sm" :icon="EditSvg">Rediger</Button>

            <Button variant="bordered" color="alert" size="sm" @click="deleteAnimal(animal.id)" class="bg-white hover:bg-rust-900 hover:text-white">
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
import type { Animal } from '~/types'
import {useFormat} from "../../../composables/useFormat";
definePageMeta({ layout: 'admin' })

const { status, species } = useAnimalMetaData()
const {bookingDateTime} = useFormat()

const supabase = useSupabaseClient()


const { data: animals, refresh } = await useAsyncData('admin-animals', async () => {
  const { data } = await supabase
    .from('animals_overview')
    .select('*')
    .order('name', { ascending: true })
  return data as Animal[]
})

async function deleteAnimal(id: string) {
  if (!confirm('Er du sikker?')) return
  await supabase.from('animals').delete().eq('id', id)
  refresh()
}
</script>
