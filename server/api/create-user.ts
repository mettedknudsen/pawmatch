import {serverSupabaseUser} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = await serverSupabaseUser(event)

  const {createClient} = await import('@supabase/supabase-js')
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  if(!user){
    throw createError({statusCode: 401, statusMessage: 'Unauthorized'})
  }

  if(user.user_metadata.role !== 'admin'){
    throw createError({statusCode: 403, statusMessage: 'Forbidden - user is not allowed to do this action'})
  }

  if(!body){
    throw createError({statusCode: 400, statusMessage: 'No data passed with the request'})
  }
  const { email, data, password } = body

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: data
  })


  if(error) {
    throw createError({statusCode: 400, statusMessage: error.message})
  }

  return {success:true}
})


