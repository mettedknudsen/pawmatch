<template>

<!--    FILTERS -->
  <div v-if="filters">
    <p>hej</p>
  </div>

<!--    OUTPUT -->
  <section class="md:grid grid-cols-12 gap-4">
    <nuxt-link :to="`/dyr/${pet.id}`" class="pet-card" v-for="pet in pets" :key="pet.id">
      <NuxtImg
        v-if="pet.image_url"
        :src="getImageUrl(pet.image_url)"
        :alt="pet.name"
        width="400"
        height="300"
        fit="cover"
        loading="lazy"
        class="w-full object-cover"
      />
      <div v-else class="w-full object-cover aspect-[1.33] flex items-center justify-center border border-b-neutral-400" :class="pet.species === 'dog' ? 'bg-rust-300 text-bark-500' : (pet.species === 'cat' ? 'bg-rust-500 text-rust-900 ' : 'bg-salvie-300 text-salvie-900')">
        <PetIcon v-if="pet.species" :species="pet.species" class="w-16 h-16" />
      </div>
      <article class="card-info">
        <div>
          <h3 class="font-roboto font-bold text-bark-900">{{pet.name}}</h3>
          <p v-if="pet.created_at" class="text-neutral-500 text-sm">{{timeInShelter(pet.created_at)}}</p>
        </div>
        <div class="flex items-center text-sm">
          <p v-if="pet.gender" class="items-center space-x.pz flex">
            <PetGender :gender="pet.gender" class="size-6" />
            <span>
            {{pet.gender === 'male' ? 'Han' : 'Hun'}}
            </span>
          </p>
          <span class="text-neutral-300 text-2xl">-</span>
          <p v-if="pet.age_months">{{age(pet.age_months, pet.created_at)}}</p>
        </div>
      </article>
    </nuxt-link>
  </section>

</template>

<script setup lang="ts">
import PetGender from "./PetGender.vue";
import {useStorage} from "../../composables/useStorage";
import {useFormat} from "../../composables/useFormat"
import type { Animal } from '~/types'

const props = defineProps<{
  paginate?: number,
  limit?: number | null,
  species?: string | null,
  filters: boolean
}>()

// FILTERS
const selectedSpecies = ref(props.species ?? null)
const selectedSize = ref<string | null>(null)
const selectedGender = ref<string | null>(null)
const goodWithChildren = ref(false)
const goodWithAnimals = ref(false)
const currentPage = ref(1)

const pageSize = props.paginate ?? 12

const supabase = useSupabaseClient()

const { data , error, refresh } = await useAsyncData('pets', async () => {
  let query = supabase
    .from('animals')
    .select('*', {count: 'exact'})
    .eq('status', 'available')
    .order('created_at', {ascending: false})

  // block limit vs pagination range
  if (props.limit) {
      query = query.limit(props.limit)
    } else {
      query = query.range(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize - 1
      )
    }

    if(selectedSpecies.value) query = query.eq('species', selectedSpecies.value)
    if(selectedSize.value) query = query.eq('size', selectedSize.value)
    if(selectedGender.value) query = query.eq('gender', selectedGender.value)
    if (goodWithAnimals.value) query = query.eq('good_with_animals', true)
    if (goodWithChildren.value) query = query.eq('good_with_children', true)

    const {data, error, count} = await query
    if(error) throw error
    return {animals: data as Animal[], total: count ?? 0}
})
const pets = computed(() => data.value?.animals ?? [])
const total = computed(() => data.value?.total ?? 0)
const pages = computed(() => Math.ceil(total.value / pageSize))
const showing  = computed(() => {
  const from = (currentPage.value - 1) * pageSize + 1
  const to = Math.min(currentPage.value * pageSize, total.value)
  return `Viser ${from}–${to} af ${total.value} dyr`
})
const { getImageUrl } = useStorage()
const { age, timeInShelter } = useFormat()

</script>
