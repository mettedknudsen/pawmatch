<template>
<section class="grid md:grid-cols-3 gap-4 pawmatch-container">
  <NuxtLink
    v-for="s in species"
    :to="s.to"
    class="flex items-center justify-center flex-col py-20 md:py-10 lg:py-20 space-y-3 rounded-lg"
    :class="s.classes"
  >
    <component :is="s.icon" v-if="s.icon" class="size-15" />
    <span class="font-inter font-medium text-bark-900">{{s.label}}</span>
    <div class="bg-neutral-200/80 text-neutral-600 space-x-1.5 border-neutral-300 text-xs lg:text-sm px-2 py-1 border rounded-full"><span v-if="s.amount > 0">{{s.amount}}</span><span>{{s.amount > 1 ? 'ledige' : s.amount === 1 ? 'ledig' : 'Ingen ledige'}}</span></div>
  </NuxtLink>
</section>
</template>
<script setup lang="ts">
import DogSvg from '~/assets/images/icons/dog.svg?component'
import CatSvg from '~/assets/images/icons/cat.svg?component'
import RabbitSvg from '~/assets/images/icons/rabbit.svg?component'

const supabase = useSupabaseClient()

const { data } = await useAsyncData('species-block', async () => {

  const {data: animals} = await supabase
      .from('animals')
      .select('species')
      .eq('status', 'available')

  return {
    dogs: animals?.filter(a => a.species === 'dog').length ?? 0,
    cats: animals?.filter(a => a.species  === 'cat').length ?? 0,
    rabbits:animals?.filter(a => a.species === 'rabbit').length ?? 0,
  }
})

const species = computed(() => [
  { amount: data.value?.cats, label: 'Katte', to: {path:'/dyr', query: {s: 'cat'}}, classes: 'bg-rust-500 hover:bg-rust-500/70 text-rust-900', icon:CatSvg},
  { amount: data.value?.dogs, label: 'Hunde',  to: {path:'/dyr', query: {s: 'dog'}}, classes: 'bg-bark-300 hover:bg-bark-300/70 text-bark-500', icon: DogSvg},
  { amount: data.value?.rabbits, label: 'Kaniner',  to: {path:'/dyr', query: {s: 'rabbit'}}, classes: 'bg-salvie-300 hover:bg-salvie-300/70 text-salvie-700', icon: RabbitSvg},
])
</script>
