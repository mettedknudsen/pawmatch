<template>

  <!--    FILTERS -->
  <div v-if="filters" class="petmatch-container px-0 my-5 flex items-center justify-between text-bark-900">
    <Button :icon="FiltersIcon" variant="bordered" color="dark"  @click="isOpen = !isOpen">
      Filtrer
    </Button>
    <p class="">{{ amountShown }}</p>
  </div>
  <div class="bg-black/50 inset-0 fixed" :class="isOpen ? 'block' : 'hidden'"  @click="isOpen = !isOpen"></div>
  <div v-if="filters" :class="isOpen ? 'translate-x-0' : '-translate-x-full'" class="filter-drawer pt-15">
    <Button :icon="CloseIcon" variant="full" color="white" @click="isOpen = !isOpen" class="!rounded-full !p-2 [&_svg]:size-5 absolute left-2 top-2"/>
    <!-- type-->
    <div class="">
      <button
        v-for="s in [
            { value: null,     label: 'Alle' },
            { value: 'dog',    label: 'Hunde' },
            { value: 'cat',    label: 'Katte' },
            { value: 'rabbit', label: 'Kaniner' },
          ]"
        :key="s.label"
        class="px-4 py-2 rounded-full"
        :class="selectedSpecies === s.value
            ? 'bg-terracotta-500 border-terracotta-500 text-white'
            : 'border-neutral-300 text-neutral-600 hover:border-terracotta-400'"
        @click="selectedSpecies = s.value"
      >
        {{ s.label }}
      </button>
    </div>
    <!-- size-->
    <select
      v-model="selectedSize"
      class="px-4 py-2 rounded-full"
    >
      <option :value="null">Alle størrelser</option>
      <option value="small">Lille</option>
      <option value="medium">Mellem</option>
      <option value="large">Stor</option>
    </select>

    <!-- gender -->
    <select
      v-model="selectedGender"
      class="px-4 py-2 rounded-full"
    >
      <option :value="null">Alle køn</option>
      <option value="male">Han</option>
      <option value="female">Hun</option>
    </select>


    <label class="flex items-center gap-2 text-sm cursor-pointer">
      <input v-model="goodWithChildren" type="checkbox" class="rounded"/>
      God med børn
    </label>
    <label class="flex items-center gap-2 text-sm cursor-pointer">
      <input v-model="goodWithAnimals" type="checkbox" class="rounded"/>
      God med dyr
    </label>

    <!-- Reset -->
    <button
      v-if="selectedSpecies || selectedSize || selectedGender || goodWithChildren || goodWithAnimals"
      class="px-4 py-2 rounded-full border border-neutral-300 text-sm text-neutral-500 hover:border-neutral-400"
      @click="selectedSpecies = null; selectedSize = null; selectedGender = null; goodWithChildren = false; goodWithAnimals = false"
    >
      Nulstil filtre
    </button>
  </div>

  <!--    OUTPUT -->
  <section class="md:grid grid-cols-12 place-items-stretch md:gap-4 space-y-4">
    <nuxt-link :to="`/dyr/${pet.id}`" class="pet-card block h-full" v-for="pet in pets" :key="pet.id">
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
      <div v-else class="w-full object-cover aspect-[1.33] flex items-center justify-center border border-b-neutral-400"
           :class="pet.species === 'dog' ? 'bg-rust-300 text-bark-500' : (pet.species === 'cat' ? 'bg-rust-500 text-rust-900 ' : 'bg-salvie-300 text-salvie-900')">
        <PetIcon v-if="pet.species" :species="pet.species" class="w-16 h-16"/>
      </div>
      <article class="card-info">
        <div>
          <h3 class="font-roboto font-bold text-bark-900">{{ pet.name }}</h3>
          <p v-if="pet.created_at" class="text-neutral-500 text-sm">{{ timeInShelter(pet.created_at) }}</p>
        </div>
        <div class="flex items-center text-sm">
          <p v-if="pet.gender" class="items-center space-x.pz flex">
            <PetGender :gender="pet.gender" class="size-6"/>
            <span>
            {{ pet.gender === 'male' ? 'Han' : 'Hun' }}
            </span>
          </p>
          <span class="text-neutral-300 text-2xl">-</span>
          <p v-if="pet.age_months">{{ age(pet.age_months, pet.created_at) }}</p>
        </div>
        <div class="tags-container">
          <!--  status  -->
          <span v-if="pet.status" :class="status[pet.status].class" class="tag">
            {{status[pet.status].label}}
          </span>
          <!--  personality  -->
          <span v-if="pet.personality" class="tag">
            {{personality[pet.personality]}}
          </span>
          <!--  hypoallergenic  -->
          <span v-if="pet.is_hypoallergenic" class="tag">
              allergivenlig
          </span>
          <span v-if="pet.good_with_children" class="tag">
              børnevenlig
          </span>
          <!--  good_with_animals  -->
          <span v-if="pet.good_with_animals" class="tag">
              god med dyr
          </span>
          <!--  neutered  -->
          <span v-if="pet.is_neutered" class="tag">
              {{ pet.gender === 'male' ? 'kastreret' : 'steriliseret' }}
          </span>
        </div>

      </article>
    </nuxt-link>
  </section>


  <!--EMPTY STATE-->
  <div v-if="pets.length === 0 && filters" class="text-center py-16 text-neutral-400">
    <p class="text-lg">Ingen dyr matcher dine filtre</p>
    <p class="text-sm mt-1">Prøv at justere eller nulstille filtrene</p>
  </div>

  <!-- PAGINATION -->
  <div v-if="pages > 1 && paginate" class="flex items-center justify-center gap-2 my-8">
    <button
      :disabled="currentPage === 1"
      class="px-4 py-2 rounded-full bg-bark-300 text-black text-sm disabled:opacity-50"
      @click="currentPage--"
    >
      <
    </button>

    <button
      v-for="p in pages"
      :key="p"
      class="w-9 h-9 rounded-full text-sm font-medium transition-colors"
      :class="p === currentPage
          ? 'bg-terrakotta text-white'
          : 'bg-white text-black'"
      @click="currentPage = p"
    >
      {{ p }}
    </button>

    <button
      :disabled="currentPage === pages"
      class="px-4 py-2 rounded-full bg-bark-300 text-black text-sm disabled:opacity-50"
      @click="currentPage++"
    >
      >
    </button>
  </div>

</template>

<script setup lang="ts">
import FiltersIcon from '~/assets/images/icons/filters.svg?component'
import CloseIcon from '~/assets/images/icons/close.svg?component'
import PetGender from "./PetGender.vue";
import {useStorage} from "../../composables/useStorage";
import {useFormat} from "../../composables/useFormat"
import type {Animal} from '~/types'
import {useFilterDrawer} from "../../composables/useFilterDrawer";

const props = defineProps<{
  paginate?: number | null,
  limit?: number | null,
  species?: string | null,
  filters: boolean,
  status?: string | null
}>()

// FILTERS

const isOpen = useFilterDrawer()

const selectedSpecies = ref(props.species ?? null)
const selectedSize = ref<string | null>(null)
const selectedGender = ref<string | null>(null)
const goodWithChildren = ref(false)
const goodWithAnimals = ref(false)
const currentPage = ref(1)

const pageSize = props.paginate ?? 12

const supabase = useSupabaseClient()

watch([selectedSpecies, selectedSize, selectedGender, goodWithChildren, goodWithAnimals], () => {
  currentPage.value = 1
})

const {data, error, refresh} = await useAsyncData('pets', async () => {
    let query = supabase
      .from('animals')
      .select('*', {count: 'exact'})
      .order('created_at', {ascending: false})


    // make the list filtered by status - can now get adopted animals or all if no status value
    if (props.status === 'available') {
      query = query.eq('status', 'available')
    } else if (props.status === 'adopted') {
      query = query.in('status', ['reserved', 'adopted'])
    }

    // block limit vs pagination range
    if (props.limit) {
      query = query.limit(props.limit)
    } else {
      query = query.range(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize - 1
      )
    }

    if (selectedSpecies.value) query = query.eq('species', selectedSpecies.value)
    if (selectedSize.value) query = query.eq('size', selectedSize.value)
    if (selectedGender.value) query = query.eq('gender', selectedGender.value)
    if (goodWithAnimals.value) query = query.eq('good_with_animals', true)
    if (goodWithChildren.value) query = query.eq('good_with_children', true)

    const {data, error, count} = await query
    if (error) throw error
    return {animals: data as Animal[], total: count ?? 0}
  },
  {watch: [currentPage, selectedSpecies, selectedSize, selectedGender, goodWithChildren, goodWithAnimals]}
)
const pets = computed(() => data.value?.animals ?? [])
const total = computed(() => data.value?.total ?? 0)
const pages = computed(() => Math.ceil(total.value / pageSize))
const amountShown = computed(() => {
  const from = (currentPage.value - 1) * pageSize + 1
  const to = Math.min(currentPage.value * pageSize, total.value)
  return `${from}–${to} af ${total.value} dyr`
})
const {getImageUrl} = useStorage()
const {age, timeInShelter} = useFormat()

const status = {
  available: {label: 'ledig', class: 'bg-salvie-300 text-salvie-900'},
  reserved: {label: 'reserveret', class: 'bg-sand text-bark-500'},
  adopted: {label: 'adopteret', class: 'bg-rust-300 text-rust-900'},
}

const personality = {
    playful: 'legesyg',
    calm: 'rolig',
    affectionate: 'kærlig'
}

</script>
