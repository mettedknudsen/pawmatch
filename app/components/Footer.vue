<template>
  <footer class="bg-bark-900 pt-5 md:pt-15 text-creme/80">
    <div class="pawmatch-container flex flex-wrap gap-y-7 md:grid col-span-2 lg:grid-cols-12 md:gap-x-4 max-md:py-5">
      <section class="col-span-2 max-lg:w-full lg:col-span-4 xl:col-span-3 xl:col-start-2 px-3 max-lg:order-first">
        <h3 class="font-bold mb-2 text-white/80">PawMatch</h3>
        <p class="text-sm leading-[2] pr-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </section>
      <nav class="col-span-1 lg:col-span-2 px-3 max-lg:order-4 max-lg:w-1/2" v-if="footerContent[0]">
        <h3 class="text-white/80 font-bold uppercase font-roboto">{{footerContent[0].heading}}</h3>
        <ul>
          <li v-for="item in footerContent[0].links" :key="item.to" class="py-2">
            <NuxtLink
              :to="item.to"
              active-class="text-salvie-700"
              :class="item.disabled ? 'pointer-events-none' : ''"
              class="hover:text-salvie-700 transition"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <nav class="col-span-1 lg:col-span-2 px-3 max-lg:order-5 max-lg:w-1/2" v-if="footerContent[1]">
        <h3 class="text-white/80 font-bold uppercase font-roboto">{{footerContent[1].heading}}</h3>
        <ul>
          <li v-for="item in footerContent[1].links" :key="item.to" class="py-2">
            <NuxtLink
              :to="item.to"
              class="hover:text-salvie-700 transition"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <article class="col-span-1 lg:col-span-4 xl:col-span-3 px-3 max-lg:order-3 max-lg:w-full" v-if="footerContent[2]">
        <div class="font-roboto flex items-center lg:space-x-5 max-lg:justify-between">
          <h3 class="text-white/80 font-bold uppercase">{{footerContent[2].heading}}</h3>
          <span class="px-3 py-1 rounded-xl border text-xs" :class="openNow ? 'bg-salvie-700/20 text-salvie-500' : 'bg-rust-900/20 text-rust-500'">{{ openNow ? 'Åbent nu' : 'Lukket' }}</span>
        </div>
        <ul class="mt-3">
          <li v-for="(item, index) in footerContent[2].openingHours" :key="index" class="py-2 flex justify-between">
            <span>{{ item.label }}</span>
            <span class="text-white/80 font-bold">{{ item.hours }}</span>
          </li>
        </ul>
        </article>
    <!--   new row   -->
      <article class="col-span-1 lg:col-span-4 xl:col-span-3 xl:col-start-2 px-3 max-lg:w-full max-lg:order-2">
        <p class="text-sm leading-[2] max-lg:-order-1">
          Grenaa Dyreinternat<br>
          Eksempelvej 12, 8500 Grenaa<br>
          tlf. 86 00 00 00
        </p>
      </article>
    </div>
    <div class="pawmatch-container py-4 mt-5 lg:mt-10 lg:py-6 border-t border-creme/30 xl:grid grid-cols-12 gap-4">
      <span class="text-xs text-creme/80 col-span-10 col-start-2 px-3">© {{ year }} PawMatch · Alle rettigheder forbeholdes</span>
    </div>
  </footer>
</template>
<script setup lang="ts">
import {useFormat} from "../composables/useFormat";
const {openNow} = useFormat()

const d = new Date();
let year = d.getFullYear();

const footerContent = [
  { heading: 'Navigation', links: [
      { to: '/dyr', label: 'Dyrene' },
      { to: '/match-quiz',label: 'Find dit match', disabled: true },
      { to: '/om-os', label: 'Om os', disabled: true },
      { to: '/kontakt', label: 'Kontakt', disabled: true },
    ]
  },
  { heading: 'Dyr',
    links: [
      { to: {path:'/dyr', query:{species: 'dog'} }, label: 'Hunde' },
      { to: {path:'/dyr', query:{species: 'cat'} }, label: 'Katte'},
      { to: {path:'/dyr', query:{species: 'rabbit'}}, label: 'Kaniner'},
    ]
  },
  { heading: 'Åbningstider',
    openingHours: [
      {hours: '10-17', label: 'Mandag - fredag'},
      {hours: '10-15', label: 'Lørdag (Ingen bookinger)'},
      {hours: 'Lukket', label: 'Søndag'}
    ]
  }
]
</script>
