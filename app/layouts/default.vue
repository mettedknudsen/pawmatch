<template>
  <div>
    <header class="py-2 bg-white sticky top-0 z-10">
      <div class="pawmatch-container flex items-center justify-between">
        <NuxtLink to="/" title="Gå til forside">
          <NuxtImg src="/pawmatch-logo.png" width="150"  alt="PawMatch Logo"/>
        </NuxtLink>
        <nav></nav>
        <div>
          <Button v-if="!isLoggedIn"
                 to="/login"
                 color="dark"
                 variant="plain"
                 :icon="UserSvg"
                 class="[&_svg]:size-6 [&_svg]:stroke-2 hover:opacity-50"
                  title="Log ind">
          <span class="hidden">Log ind</span>
        </Button>
          <UDropdownMenu
            v-else
            arrow
            :items="items"
            :ui="{
              content: 'w-60 lg:w-48 max-lg:[&_button]:!p-3'
            }"
          >
            <UButton icon="i-lucide-circle-user-round" color="neutral" variant="ghost" class="[&_span]:size-6" />
          </UDropdownMenu>
        </div>

      </div>
    </header>
    <slot />
    <footer>

    </footer>
  </div>
</template>
<script setup lang="ts">
import UserSvg from '~/assets/images/icons/user.svg?component'

const { isAdmin, isLoggedIn, signOut } = useAuth()

import type { DropdownMenuItem } from '@nuxt/ui'

const items = ref<DropdownMenuItem[]>([
  ... (isAdmin ? [
    {
      label: 'Adminpanel',
      icon: 'i-lucide-log-in',
      onSelect(e: Event){
        e.preventDefault()
        navigateTo('/admin')
      }
    },
    {
      label: 'Bookinger',
      icon: 'i-lucide-calendar',
      onSelect(e: Event){
        e.preventDefault()
        navigateTo('/admin/bookinger')
      }
    },
    {
      label: 'Dyr',
      icon: 'i-lucide-calendar',
      onSelect(e: Event){
        e.preventDefault()
        navigateTo('/admin/dyr')
      }
    },
  ] : []),
  ... (isLoggedIn ? [
  {
    label: 'Log ud',
    icon: 'i-lucide-log-out',
    onSelect(e: Event){
      e.preventDefault()
      signOut()
    }
  }
  ] : []),
  ... (isLoggedIn && !isAdmin ? [
    {
      label: 'Brugerindstillinger',
      icon: 'i-lucide-user-round-cog',
      onSelect(e: Event){
        e.preventDefault()
        navigateTo('/bruger')
      }
    },
    {
      label: 'Favoritter',
      icon: 'i-lucide-heart',
      onSelect(e: Event){
        e.preventDefault()
        navigateTo('/favoritter')
      }
    },
    {
      label: 'Bookinger',
      icon: 'i-lucide-calendar',
      onSelect(e: Event){
        e.preventDefault()
        navigateTo('/bookinger')
      },
    },
  ] : []),
])
</script>

