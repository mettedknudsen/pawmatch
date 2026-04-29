<template>
  <nuxt-link :to="`/dyr/${pet.id}`" class="pet-card block h-full">
    <div class="group overflow-hidden" v-if="pet.images.length > 0">
    <NuxtImg
      :src="getImageUrl(pet.images[0])"
      :alt="pet.name"
      width="600"
      height="450"
      fit="cover"
      loading="lazy"
      class="w-full object-cover bg-neutral-200 h-auto object-cover transition duration-500 group-hover:scale-110"
    />
    </div>
    <div v-else class="w-full object-cover aspect-[1.33] flex items-center justify-center border border-b-neutral-400"
         :class="pet.species === 'dog' ? 'bg-bark-300 text-bark-500' : (pet.species === 'cat' ? 'bg-rust-500 text-rust-900 ' : 'bg-salvie-300 text-salvie-900')">
      <PetIcon v-if="pet.species" :species="pet.species" class="w-16 h-16"/>
    </div>
    <article class="card-info">
      <div>
        <h3 class="font-inter font-bold text-bark-900">{{ pet.name }}
          <template v-if="pet.breed">
            <span class="px-2 text-rust-900">|</span>
            <span class="font-normal text-sm">{{pet.breed}}</span>
          </template>
        </h3>
        <p v-if="pet.created_at" class="text-neutral-500 text-xs mt-1">{{ timeInShelter(pet.created_at) }}</p>
      </div>
      <div class="flex items-center text-sm py-2">
        <p v-if="pet.gender" class="items-center flex">
          <PetGender :gender="pet.gender" class="size-6"/>
          <span>
            {{ gender[pet.gender] }}
            </span>
        </p>
        <span class="text-neutral-300">-</span>
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
</template>
<script setup lang="ts">
import {useStorage} from "../../composables/useStorage";
import {useFormat} from "../../composables/useFormat"
import PetGender from "./PetGender.vue";

import type {Animal} from '~/types'

defineProps<{pet: Animal}>()

const {getImageUrl} = useStorage()
const {age, timeInShelter} = useFormat()

const { status, gender, personality } = useAnimalMetaData()

</script>
