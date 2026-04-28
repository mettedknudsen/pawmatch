<template>
  <div class="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
    <table class="w-full text-sm">

      <thead class="bg-neutral-50 border-b border-neutral-200">
      <tr>
        <th class="text-left text-bark-500  px-4 py-3 font-medium">Detaljer</th>
        <th class="text-left text-bark-500  px-4 py-3 font-medium max-sm:hidden">Tidspunkt</th>
        <th class="text-left text-bark-500  px-4 py-3 font-medium max-md:hidden">Kontaktinformationer</th>
        <th class="text-left text-bark-500  px-4 py-3 font-medium max-lg:hidden">Bemærkninger</th>
        <th class="px-4 py-3"><p class="text-left text-bark-500 font-medium sm:hidden max-sm:text-right">Tidspunkt</p></th>
      </tr>
      </thead>

      <tbody class="divide-y divide-neutral-100">
      <tr v-if="loading" v-for="n in defaultRows ?? 4" class="h-[130px] sm:h-[90px]">
          <td class="px-4 py-3 px-4 py-3 animate-pulse bg-neutral-300 border-3 border-light"></td>
          <td class="px-4 py-3 px-4 py-3 animate-pulse bg-neutral-300 max-sm:hidden border-3 border-light"></td>
          <td class="px-4 py-3 px-4 py-3 animate-pulse bg-neutral-300 max-md:hidden border-3 border-light"></td>
          <td class="px-4 py-3 px-4 py-3 animate-pulse bg-neutral-300 max-lg:hidden border-3 border-light"></td>
          <td class="px-4 py-3 px-4 py-3 animate-pulse bg-neutral-300 border-3 border-light"></td>
      </tr>
      <tr v-else v-for="booking in bookings" :key="booking.id" class="align-top" :class="booking.status === 'cancelled' ? 'bg-rust-900/10' : booking.status === 'completed' ? 'bg-neutral-500/10' : '' ">
        <td class="px-4 py-3 font-medium text-bark-900 space-x-3">
          <ConfirmedSvg class="text-salvie-700" v-if="booking.status === 'confirmed'"/>
          <CancelledSvg v-else-if="booking.status === 'cancelled'" class="text-rust-900" />
          <ConfirmedSvg class="text-salvie-700" v-else/>
          <div>
            <NuxtLink :to="`/admin/dyr/${booking.animal_id}`" class="font-bold text-bark-500 max-md:inline hover:text-terrakotta">{{booking.animal_name}}</NuxtLink>
            <span class="mx-1 md:hidden" v-if="booking.animal_id">-</span>
            <p class=" max-md:inline">{{ appointmentType[booking.meeting_type] }}</p>
            <div class="md:hidden mt-1">
              <p class="text-bark-500 font-semibold align-top">{{booking.user_name}}</p>
              <a :href="`mailto:${booking.user_email}`" class="hover:text-terrakotta max-md:text-xs block">{{booking.user_email}}</a>
              <a :href="`tel:${booking.user_phone}`" class="hover:text-terrakotta max-md:text-xs block">{{booking.user_phone}}</a>
            </div>
            <p class="italic bg-neutral-200 p-1 rounded mt-1 lg:hidden max-sm:max-w-[180px] max-w-[250px] max-sm:text-xs" v-if="booking.notes">{{booking.notes}}</p>
          </div>
        </td>
        <td class="px-4 py-3 font-medium text-bark-900 max-sm:hidden align-top">
          <p>{{ bookingDateTime(booking.starts_at, booking.duration_minutes).dateShort }}</p>
          <p class="font-bold text-bark-500">{{ bookingDateTime(booking.starts_at, booking.duration_minutes).time }}</p>
        </td>
        <td class=" text-neutral-600 px-4 py-3 max-md:hidden align-top flex flex-col align-start">
          <p class="text-bark-500 font-semibold">{{booking.user_name}}</p>
          <a :href="`mailto:${booking.user_email}`" class="hover:text-terrakotta">{{booking.user_email}}</a>
          <a :href="`tel:${booking.user_phone}`" class="hover:text-terrakotta">{{booking.user_phone}}</a>
        </td>
        <td class="px-4 py-3 max-lg:hidden align-top">
          <p class="italic bg-neutral-200 p-1 rounded max-w-[300px]" v-if="booking.notes">{{booking.notes}}</p>
        </td>
        <td class="px-4 py-3 align-top">
          <div class="sm:hidden mt-2 mb-6 text-right">
            <p>{{ bookingDateTime(booking.starts_at, booking.duration_minutes).dateShort }}</p>
            <p class="font-bold text-bark-500">{{ bookingDateTime(booking.starts_at, booking.duration_minutes).time }}</p>
          </div>
          <div class="flex gap-2 justify-end">
            <Button variant="bordered" :to="`/admin/bookinger/${booking.id}`" color="dark" size="sm" :icon="EditSvg" class="h-8" data-action="edit"></Button>
            <Button variant="bordered" @click="cancelBooking(booking.id)" color="alert" size="sm" class="bg-transparent hover:bg-rust-900 hover:text-white h-8"  v-if="booking.status === 'confirmed'">
              Aflys
            </Button>
            <Button variant="bordered" @click="deleteBooking(booking.id)" color="alert" class="bg-transparent hover:bg-rust-900 hover:text-white [&_svg]:size-5 h-8" :icon="DeleteSvg" data-action="delete" v-else-if="booking.status === 'cancelled'">
            </Button>
          </div>
        </td>
      </tr>
      </tbody>

    </table>

    <!--   empty  -->
    <div v-if="bookings.length === 0 && !loading" class="text-center py-16 text-bark-900">
      <p class="text-lg">Der er ingen bookinger</p>
      <Button
        :icon="PlusSvg"
        class="mt-3"
        to="/admin/bookinger/opret"
      >
        Tilføj booking
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useFormat} from "../../composables/useFormat";
import Button from "../Button.vue";

import ConfirmedSvg from '~/assets/images/icons/confirmed.svg?component'
import PlusSvg from '~/assets/images/icons/plus.svg?component'
import CancelledSvg from '~/assets/images/icons/cancelled.svg?component'
import DeleteSvg from '~/assets/images/icons/delete.svg?component'
import EditSvg from '~/assets/images/icons/edit.svg?component'

const {bookingDateTime} = useFormat()
const {appointmentType} = useAnimalMetaData()

import type {Booking} from '~/types'

const supabase = useSupabaseClient()
const props = defineProps<{
  bookings: Booking[]
  loading?: boolean,
  defaultRows?: number,
  refresh?: () => void
}>()
async function deleteBooking(id: string) {
  if (!confirm('Er du sikker på du vil slette denne booking?')) return
  const {error} = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)
  if (error) console.error(error)
  props.refresh()
}
async function cancelBooking(id: string) {
  if (!confirm('Er du sikker på du vil aflyse denne booking?')) return
  const {error} = await supabase
    .from('bookings')
    .update({status: 'cancelled'})
    .eq('id', id)
  if (error) console.error(error)
  props.refresh()
}

</script>
