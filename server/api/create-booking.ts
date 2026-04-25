
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { createClient } = await import('@supabase/supabase-js')
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  let guest_id: string

  // First i make the guest for the booking
  if (body.user) {
    // if logged in - check for existing guest
    const {data: existingGuest} = await supabase.from('guests')
      .select('id')
      .eq('profile_id', body.user.id) // matching the logged in user's id
      .maybeSingle()

    if (existingGuest) {
      guest_id = existingGuest.id
    } else {
      // create one if the user has no guest tied to it
      const {data} = await supabase.from('guests')
        .insert({
          full_name: body.profile?.full_name ?? '',
          email: body.user.email,
          profile_id: body.user.id,
          phone: body.user.phone ?? null
        })
        .select('id')
        .single()

      guest_id = data.id
    }

  } else {
    //  if not logged in make a guest user from form data
    const {data} = await supabase
      .from('guests')
      .insert({
        full_name: body.form.guest_full_name,
        email: body.form.guest_email || null,
        phone: body.form.guest_phone || null,
      })
      .select('id')
      .single()

    guest_id = data.id
  }

  // after we have the guest we're ready to create booking
  const {error: error} = await supabase.from('bookings')
    .insert({
      guest_id,
      animal_id: body.form.animal_id || null,
      timeslot_id: body.form.timeslot_id,
      meeting_type: body.form.meeting_type,
      notes: body.form.notes || null,
      status: 'confirmed'
    })

  if (error) {
    console.error('CREATE BOOKING ERROR:', error)
    throw error
  }
  // booking made, now set succes to give receipt
  return {success: true}
})
