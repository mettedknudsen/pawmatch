<template>
  <aside class="z-40 fixed inset-0 bg-bark-500 size-full overflow-y-scroll transition-transform duration-300 md:hidden"
         :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
    <div class="top-3 absolute inset-x-0 mx-5 flex justify-end">
      <Button :icon="CloseIcon" variant="bordered" color="white" @click="isOpen = !isOpen"
              class="!rounded-full !p-1 [&_svg]:size-4 mb-3"/>
    </div>
    <NuxtLink to="/" title="Gå til forside" class="absolute top-6 left-7">
      <NuxtImg src="/pawmatch-logo-simple.png" width="100" alt="PawMatch Logo" @click="isOpen = false"/>
    </NuxtLink>
    <nav class="py-20 px-7">
      <ul class="space-y-3 text-white/90">
        <li>
          <NuxtLink
            to="/booking"
            active-class="text-salvie-700"
            @click="isOpen = false"
          >
            Book tid
          </NuxtLink>
        </li>
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            active-class="text-salvie-700"
            :class="item.disabled ? 'pointer-events-none' : ''"
            @click="isOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
      <ul class="space-y-3 mt-5 pt-5 border-t border-bark-300/30">
        <li v-for="item in userMenuItems" :key="item.label">
          <Button color="white" variant="plain" class="!p-0" @click="handleClick(item, $event)">
            {{ item.label }}
          </Button>
        </li>
      </ul>
    </nav>
  </aside>
  <header class="py-2 bg-white sticky top-0 z-10 shadow-sm">
    <div class="pawmatch-container flex items-center justify-between">
      <NuxtLink to="/" title="Gå til forside" class="flex-1">
        <NuxtImg src="/pawmatch-logo.png" width="150" alt="PawMatch Logo"/>
      </NuxtLink>

      <nav class="max-md:hidden flex-2">
        <ul class="md:flex items-center space-x-4 justify-center">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              active-class="text-salvie-700"
              class="text-bark-500 hover:text-salvie-700 font-semibold transition-colors"
              :class="item.disabled ? 'pointer-events-none' : ''"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="flex items-center space-x-2 max-md:hidden flex-1 justify-end">
      <client-only>
        <UDropdownMenu
          arrow
          :items="userMenuItems"
          :ui="{
            content: 'w-48 max-md:hidden'
          }"
        >
          <UButton icon="i-lucide-circle-user-round" color="neutral" variant="ghost"
                   class="[&_span]:size-6 hover:text-salvie-700 hover:bg-transparent"/>
        </UDropdownMenu>
      </client-only>

        <Button
          :to="route.matched[0].path ==='/dyr/:id()' ? {path: '/booking', query: {dyr: route.params.id} }: '/booking'"
          color="alert" size="sm" class="hover:bg-rust-900-hover">Book en tid
        </Button>
      </div>
      <Button class="md:hidden" variant="bordered" color="dark" @click="isOpen = !isOpen" :icon="MenuIcon"></Button>
    </div>
  </header>
</template>
<script setup lang="ts">
import CloseIcon from '~/assets/images/icons/close.svg?component'
import MenuIcon from '~/assets/images/icons/menu.svg?component'
import {useNavMenu} from "../composables/useNavMenu";

const isOpen = useNavMenu()
const route = useRoute()

const {isAdmin, isLoggedIn, signOut} = useAuth()

function handleClick(item: MenuItem, e: Event) {
  if (item.onSelect) {
    e.preventDefault()
    item.onSelect(e)
  }
  if (item.to) {
    navigateTo(item.to)
  }
  isOpen.value = false
}

const userMenuItems = computed<MenuItem[]>(() => [
  ...(isLoggedIn.value ? [
    ...(isAdmin.value ? [
      {
        label: 'Adminpanel',
        icon: 'i-lucide-log-in',
        to: '/admin'
      },
      {
        label: 'Bookinger',
        icon: 'i-lucide-calendar',
        to: '/admin/bookinger'
      },
      {
        label: 'Dyr',
        icon: 'i-maki-dog-park',
        to: '/admin/dyr'
      },
      {
        label: 'Brugere',
        icon: 'i-lucide-users',
        to: '/admin/brugere'
      },
    ] : [
      {
        label: 'Brugerindstillinger',
        icon: 'i-lucide-user-round-cog',
        to: '/bruger'
      },
      {
        label: 'Bookinger',
        icon: 'i-lucide-calendar',
        to: '/bruger/bookinger'
      },
    ]),
    {
      label: 'Log ud',
      icon: 'i-lucide-log-out',
      onSelect(e: Event) {
        e.preventDefault()
        signOut()
      }
    }
  ] : [
    {
      label: 'Log ind',
      icon: 'i-lucide-log-in',
      to: '/login'
    },
    {
      label: 'Opret profil',
      icon: 'i-lucide-user-round-plus',
      to: '/register'
    },
  ]),
])

const navItems = [
  {to: '/match-quiz', label: 'Find dit match'},
  {to: '/dyr', label: 'Dyrene', disabled: false},
  {label: 'Om os', disabled: true},
  {label: 'Kontakt', disabled: true},
]
</script>
