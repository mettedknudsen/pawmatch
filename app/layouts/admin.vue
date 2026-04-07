<template>
  <div class="min-h-screen flex">
    <!-- sidebar -->
    <aside class="bg-bark-900 text-white flex flex-col">
      <div class="p-6 border-b border-white/10">
        <p>PetMatch | <strong>Admin</strong></p>
        <p>{{profile?.full_name}}</p>
      </div>

      <!--   menu   -->
      <nav class="flex-1">
        <NuxtLink v-for="item in [
            {to: '/admin', text: 'Dashboard'},
            {to: '/admin/dyr', text: 'Dyr'},
            {to: '/admin/bookinger', text: 'Bookinger'},
            {to: '/admin/sider', text: 'Sider'}
          ]"
        :key="item.to"
        :to="item.to"
        class="px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        active-class="bg-white/30 text-white">
            {{item.text}}
        </NuxtLink>
      </nav>

    </aside>

    <!-- content-->
    <main>
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()


  const {data: profile} = await useAsyncData('admin-profile', async () => {
    if (!user.value) return null
    const {data} = await supabase.from('profiles')
      .select('role, full_name')
      .eq('id', user.value.id)
      .single()
    return data
  })

//   REDIRECT IF NOT ADMIN
  if (!user.value || profile.value?.role !== 'admin') {
    await navigateTo('/login')
  }

  async function signOut() {
    await supabase.auth.signOut()
    navigateTo('/')
  }

</script>
