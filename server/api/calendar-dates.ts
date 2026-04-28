import {Temporal} from "temporal-polyfill";
export default defineEventHandler(async (event) => {
  const {createClient} = await import('@supabase/supabase-js')
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )
  const now = Temporal.Now.instant()

  const {data: timeslots, error} = await supabase
    .from('timeslots')
    .select('id, starts_at, capacity')
    .gte('starts_at', now) // only upcoming timeslots

  if(error)throw error
  if(!timeslots?.length) return []

  // mapping ids to find bookings from timeslot_ids
  const ids = timeslots.map(timeslot => timeslot.id)

  // bookings as timeslot_ids
  const {data:bookings} = await supabase.from('bookings')
    .select('timeslot_id')
    .in('timeslot_id', ids)
    .neq('status', 'cancelled')

  // get bookings counts for timeslots
  // < timeslot_id, booking count >
  const counts: Record<string, number> = {}

  // +1 each time the timeslot_id is in the bookings array
  for(const b of bookings || []) {
    counts[b.timeslot_id] = (counts[b.timeslot_id] || 0) + 1
  }

    // extracting the available dates for calendar
  const availableDates = new Set<string>()

  for(const slot of timeslots){
    const booked = counts[slot.id] || 0

    if(booked < slot.capacity){
      // remove time from the starts_at value - set handles unique values
      availableDates.add(slot.starts_at.split('T')[0])
    }
  }
  // return as an array
  return Array.from(availableDates)
})
