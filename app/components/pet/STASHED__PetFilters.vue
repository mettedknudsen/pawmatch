<template>
  <!--    FILTERS -->
  <div class="petmatch-container px-0 my-5 flex items-center justify-between text-bark-900">
    <Button :icon="FiltersIcon" variant="bordered" color="dark"  @click="isOpen = !isOpen">
      Filtrer
    </Button>
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
            v-model="filter.model"
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
        <input v-model="filter.model" type="checkbox" class="size-6 accent-rust-900"/>
        {{ filter.label }}
      </label>
    </div>

    <!-- Reset -->
    <div class="bottom-0 pb-3 absolute inset-x-0 mx-5 border-t border-rust-900 bg-light">
      <Button v-if="hasActiveFilters"
              variant="bordered" color="alert" class="hover:bg-rust-900 hover:text-white mt-3"
              @click="emit('reset')"
      >
        Nulstil filtre
      </Button>
    </div>

  </div>

</template>
<script setup lang="ts">
import FiltersIcon from '~/assets/images/icons/filters.svg?component'
import CloseIcon from '~/assets/images/icons/close.svg?component'

const props = defineProps<{
  modelValue: {
    selectedSpecies: Ref<string | null>
    selectedSize: Ref<string | null>
    selectedGender: Ref<string | null>
    goodWithChildren: Ref<boolean>
    goodWithAnimals: Ref<boolean>
  }
  total: number
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  reset: []
}>()


const filterGroups = [
  {
    label: null,
    model: toRef(props.modelValue, 'selectedSpecies'),
    options: [
      { value: null, label: 'Alle' },
      { value: 'dog', label: 'Hunde' },
      { value: 'cat', label: 'Katte' },
      { value: 'rabbit', label: 'Kaniner' }
    ]
  },
  {
    label: 'Størrelse',
    model: toRef(props.modelValue, 'selectedSize'),
    options: [
      { value: null, label: 'Alle' },
      { value: 'small', label: 'Lille' },
      { value: 'medium', label: 'Mellem' },
      { value: 'large', label: 'Stor' },
    ]
  },
  {
    label: 'Køn',
    model: toRef(props.modelValue, 'selectedGender'),
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
    model: toRef(props.modelValue, 'goodWithChildren'),
  },
  {
    label: 'God med dyr',
    model: toRef(props.modelValue, 'goodWithAnimals'),
  }
]


const isOpen = useFilterDrawer()

const amountShown = computed(() => {
  const from = (props.currentPage - 1) * props.pageSize + 1
  const to = Math.min(props.currentPage * props.pageSize, props.total)
  return `${from}–${to} af ${props.total} dyr`
})

const hasActiveFilters = computed(() =>
  props.modelValue.selectedSpecies.value ||
  props.modelValue.selectedSize.value ||
  props.modelValue.selectedGender.value ||
  props.modelValue.goodWithChildren.value ||
  props.modelValue.goodWithAnimals.value
)
</script>
