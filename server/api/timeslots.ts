import {Temporal} from "temporal-polyfill";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const date = query.date as string
  const animalId = query.animal_id as string | undefined

  if (!date) throw createError({statusCode: 400, statusMessage: 'Missing Date'})

  const {createClient} = await import('@supabase/supabase-js')
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  // timeslots

  const dateZoned = Temporal.PlainDate.from(date).toZonedDateTime('Europe/Copenhagen')
  const now = Temporal.Now.instant()
  let startOfSelectedDay = dateZoned.startOfDay().toInstant()

  // We need to check if the timeslots have already passed
  if(Temporal.Instant.compare(now, startOfSelectedDay) > 0){
    startOfSelectedDay = now
  }

  // start of selected day or the current time, if that is later
  const start = startOfSelectedDay.toString()

  // start of the day
  const end = dateZoned.add({days: 1}).startOfDay().toInstant().toString()

  const {data: timeslots, error: timeslotError} = await supabase
    .from('timeslots')
    .select('*')
    .gte('starts_at', start) // greater than (first minute of the day)
    .lt('starts_at', end) // less than (start of the next day)
    .order('starts_at')

  if(timeslotError) throw timeslotError
  if(!timeslots?.length) return []

  // put ids into new array
  const timeslotIds = timeslots.map(t => t.id)


  // bookings as timeslot_ids
  const {data:bookings, error:bookingError} = await supabase.from('bookings')
    .select('timeslot_id')
    .in('timeslot_id', timeslotIds)
    .neq('status', 'cancelled')

  if(bookingError) throw bookingError

  // get bookings counts for timeslots
  // < timeslot_id, booking count >
  const counts: Record<string, number> = {}

  // +1 each time the timeslot_id is in the bookings array
  for(const b of bookings || []) {
    counts[b.timeslot_id] = (counts[b.timeslot_id] || 0) + 1
  }

  // initiate the set
  let animalBookedTSIds= new Set<string>()
  if(animalId) {
  // lookup the bookings of animals and get the timeslot ids
  const {data:animalBookings} = await supabase.from('bookings')
    .select('timeslot_id')
    .eq('animal_id', animalId)
    .neq('status', 'cancelled')

    // set of (unique) timeslots
    animalBookedTSIds = new Set(animalBookings?.map(b=>b.timeslot_id))
  }


  return timeslots.map(slot => {
    const bookedCount = counts[slot.id] || 0
    const remainingCapacity = slot.capacity - bookedCount

    return {
      ...slot,
      remaining_spots: remainingCapacity
    }
  }).filter(slot => {
    if (slot.remaining_spots <= 0) return false // filter out if capacity reached
    if (animalId && animalBookedTSIds.has(slot.id)) return false // filter out if animal is already booked on timeslot
    return true
  })
})
