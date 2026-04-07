<template>
  <!--    FILTERS -->
  <template v-if="filters">
  <div class="pawmatch-container px-0 my-5 flex items-center justify-between text-bark-900">
    <div class="flex items-center space-x-2">
      <Button :icon="FiltersIcon" variant="bordered" color="dark"  @click="isOpen = !isOpen">
        Filtrer
      </Button>
      <Button v-if="hasActiveFilters"
              variant="plain" color="dark" class="hover:text-bark-500 hover:opacity-75"
              @click="resetFilters"
      >
        Nulstil filtre
      </Button>
    </div>

    <p class="">{{ amountShown }}</p>
  </div>

  <div class="bg-black/50 inset-0 fixed" :class="isOpen ? 'block' : 'hidden'"  @click="isOpen = !isOpen"></div>
  <div :class="isOpen ? 'translate-x-0' : '-translate-x-full'" class="filter-drawer py-10 sm:py-15 px-5 shadow-xl">
    <div class="top-3 absolute inset-x-0 mx-5 flex justify-end">
      <Button :icon="CloseIcon" variant="bordered" color="alert" @click="isOpen = !isOpen" class="!rounded-full !p-2 [&_svg]:size-4 mb-3 hover:bg-rust-900 hover:text-white"/>
    </div>


    <div class="py-5 overflow-y-scroll w-full h-full">
      <fieldset v-for="(filter, index) in filterGroups"
                :key="index"
                class="my-4 pb-4 space-x-2 border-b border-rust-900/25">
        <legend
          class="mb-4 text-rust-900 text-base"
          v-if="filter.label">
          {{ filter.label }}
        </legend>

        <label class="cursor-pointer"
               v-for="option in filter.options"
               :key="String(option.value)">

          <input
            type="radio"
            :value="option.value"
            v-model="filter.model.value"
            class="peer hidden"
          />
          <span class="px-2 sm:px-4 py-2 rounded-lg peer-checked:border border-rust-900 transition-all">
          {{ option.label }}
          </span>
        </label>
      </fieldset>

      <label
        v-for="(filter, index) in checkboxFilters"
        :key="index"
        class="flex items-center gap-2 text-sm cursor-pointer border rounded-lg p-2 border-rust-900 mb-2">
        <input v-model="filter.model.value" type="checkbox" class="size-6 accent-rust-900"/>
        {{ filter.label }}
      </label>
    </div>

    <!-- Reset -->
    <div class="bottom-0 pb-3 absolute inset-x-0 mx-5 border-t border-rust-900 bg-light">
      <Button v-if="hasActiveFilters"
              variant="bordered" color="alert" class="hover:bg-rust-900 hover:text-white mt-3"
              @click="resetFilters"
      >
        Nulstil filtre
      </Button>
    </div>

  </div>
  </template>
  <PetGrid :pets="pets" :loading="pending" @reset="resetFilters"/>
  <Pagination
    v-if="pages > 1 && paginate"
    v-model="currentPage"
    :pages="pages"
  />

</template>

<script setup lang="ts">
import type {Animal} from '~/types'
import FiltersIcon from '~/assets/images/icons/filters.svg?component'
import CloseIcon from '~/assets/images/icons/close.svg?component'

const props = defineProps<{
  paginate?: number | null,
  limit?: number | null,
  species?: string | null,
  filters: boolean,
  status?: string | null
}>()


// FILTER REFS
const selectedSpecies = ref(props.species ?? null)
const selectedSize = ref<string | null>(null)
const selectedGender = ref<string | null>(null)
const goodWithChildren = ref(false)
const goodWithAnimals = ref(false)
const currentPage = ref(1)

const pageSize = props.paginate ?? 12

const supabase = useSupabaseClient()

const filterGroups = [
  {
    label: null,
    model: selectedSpecies,
    options: [
      { value: null, label: 'Alle' },
      { value: 'dog', label: 'Hunde' },
      { value: 'cat', label: 'Katte' },
      { value: 'rabbit', label: 'Kaniner' }
    ]
  },
  {
    label: 'Størrelse',
    model: selectedSize,
    options: [
      { value: null, label: 'Alle' },
      { value: 'small', label: 'Lille' },
      { value: 'medium', label: 'Mellem' },
      { value: 'large', label: 'Stor' },
    ]
  },
  {
    label: 'Køn',
    model: selectedGender,
    options: [
      { value: null, label: 'Alle' },
      { value: 'male', label: 'Han' },
      { value: 'female', label: 'Hun' },
    ]
  }
]

const checkboxFilters= [
  {
    label: 'God med børn',
    model: goodWithChildren,
  },
  {
    label: 'God med dyr',
    model: goodWithAnimals,
  }
]


// watch for value changes - set currentpage to 1
watch([selectedSpecies, selectedSize, selectedGender, goodWithChildren, goodWithAnimals], () => {
  currentPage.value = 1
})

const {data, error, refresh, pending} = await useAsyncData('pets', async () => {
    let query = supabase
      .from('animals')
      .select('*', {count: 'exact'})
      .order('created_at', {ascending: false})

    if (props.status === 'available') {
      query = query.eq('status', 'available')
    } else if (props.status === 'adopted') {
      query = query.in('status', ['reserved', 'adopted'])
    }

    if (props.limit) {
      query = query.limit(props.limit)
    } else {
      query = query.range(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize - 1
      )
    }

    // add filters
    if (selectedSpecies.value) query = query.eq('species', selectedSpecies.value)
    if (selectedSize.value) query = query.eq('size', selectedSize.value)
    if (selectedGender.value) query = query.eq('gender', selectedGender.value)
    if (goodWithAnimals.value) query = query.eq('good_with_animals', true)
    if (goodWithChildren.value) query = query.eq('good_with_children', true)

    const {data, error, count} = await query
    if (error) throw error
    return {animals: data as Animal[], total: count ?? 0}
  },
  // watch - get data if values changes
  {watch: [currentPage, selectedSpecies, selectedSize, selectedGender, goodWithChildren, goodWithAnimals]}
)

const isOpen = useFilterDrawer()

const amountShown = computed(() => {
  const from = (currentPage.value - 1) * pageSize + 1
  const to = Math.min(currentPage.value * pageSize, total.value)
  return `${from}–${to} af ${total.value} dyr`
})


const pets = computed(() => data.value?.animals ?? [])
const total = computed(() => data.value?.total ?? 0)
const pages = computed(() => Math.ceil(total.value / pageSize))

const hasActiveFilters = computed(() =>
  selectedSpecies.value ||
  selectedSize.value ||
  selectedGender.value ||
  goodWithChildren.value ||
  goodWithAnimals.value
)

function resetFilters() {
  selectedSpecies.value = null
  selectedSize.value = null
  selectedGender.value = null
  goodWithChildren.value = false
  goodWithAnimals.value = false
}
</script>
