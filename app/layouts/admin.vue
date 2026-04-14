<template>
  <div class="h-screen lg:grid grid-cols-12">
    <div class="bg-black/50 inset-0 fixed lg:hidden" :class="isOpen ? 'block' : 'hidden'"  @click="isOpen = !isOpen"></div>
    <aside class="admin-menu-drawer" :class="isOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'">
      <div class="top-3 absolute inset-x-0 mx-5 flex justify-end lg:hidden">
        <Button :icon="CloseIcon" variant="bordered" color="white" @click="isOpen = !isOpen" class="!rounded-full !p-2 [&_svg]:size-4 mb-3 hover:bg-white hover:text-bark-900"/>
      </div>
      <div class="mb-7 pb-2 border-b border-white/10 space-y-2">
        <NuxtLink to="/" class="block">
          <NuxtImg src="/pawmatch-logo-simple.png" width="100" alt="PawMatch Logo"/>
        </NuxtLink>
        <span class="text-bark-300 text-sm opacity-90">Admin</span>
      </div>

      <!--   menu   -->
      <nav class="space-y-2 flex-1">
        <NuxtLink v-for="item in [
            {to: '/admin', text: 'Overblik'},
            {to: '/admin/bookinger', text: 'Bookinger'},
            {to: '/admin/dyr', text: 'Dyr'},
            {to: '/admin/tider', text: 'Tider'},
            {to: '/admin/brugere', text: 'Brugere'},
            {to: '/admin/sider', text: 'Sider'},
          ]"
        :key="item.to"
        :to="item.to"
        class="block px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        :class="isActive(item) ? 'bg-white/30 hover:bg-white/30 text-white' : ''">
            {{item.text}}
        </NuxtLink>
      </nav>
      <p class="mb-2">
      {{profile?.full_name}}
      </p>
      <Button @click="signOut()" type="button" color="white" variant="bordered" class="hover:bg-white/75 hover:text-bark-900" :icon="LogoutSvg">Log ud</Button>
    </aside>

    <!-- content-->
    <main class="col-span-10 max-h-screen overflow-y-scroll p-4 lg:p-8">
      <Button class="mb-7 lg:hidden" variant="bordered" color="dark"  @click="isOpen = !isOpen" :icon="MenuIcon"></Button>
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import LogoutSvg from '~/assets/images/icons/logout.svg?component'
import CloseIcon from '~/assets/images/icons/close.svg?component'
import MenuIcon from '~/assets/images/icons/Menu.svg?component'
import {useAdminMenu} from "../composables/useAdminMenu";

const isOpen = useAdminMenu()

const { user, profile, isAdmin, isLoggedIn, signOut } = useAuth()


//   REDIRECT IF NOT ADMIN
  if (!isLoggedIn || !isAdmin) {
    await navigateTo('/login')
  }

const route = useRoute()
const isActive = (item) => {
  if (route.fullPath === item.to ) return true
  return route.fullPath.includes(item.to) && item.to !== '/admin'

}

</script>
