<template>
  <section class="md:grid grid-cols-12 place-items-stretch md:gap-4 space-y-4">
<!--    loading -->
    <div v-if="loading" v-for="n in 6" class="col-span-4 h-130 rounded-xl loading-animate"></div>
<!--    output -->
    <template v-else>
      <PetCard
        v-for="pet in pets"
        :pet="pet"
        :key="pet.id"
      />
    </template>
  </section>

<!--   empty  -->
  <div v-if="pets.length === 0 && !loading" class="text-center py-16 text-bark-900">
    <p class="text-lg">Ingen dyr matcher dine filtre</p>
    <Button v-if="selectedSpecies || selectedSize || selectedGender || goodWithChildren || goodWithAnimals"
            variant="bordered" color="dark" class="mt-3"
            @click="selectedSpecies = null; selectedSize = null; selectedGender = null; goodWithChildren = false; goodWithAnimals = false"
    >
      Nulstil filtre
    </Button>
  </div>
</template>
<script setup lang="ts">
import PetCard from "./PetCard.vue";
import Button from "../Button.vue";
import type {Animal} from '~/types'

defineProps<{
  pets: Animal[]
  loading?: boolean
}>()

</script>
