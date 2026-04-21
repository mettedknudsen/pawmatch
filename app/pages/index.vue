<template>
  <main class="mb-10 lg:mb-20">
    <Hero />
    <AnimalGrid/>
    <CtaBanner />
    <TextImage/>
    <SpeciesSelect/>
  </main>
</template>
<script setup lang="ts">

import Hero from "../components/blocks/Hero.vue";
import AnimalGrid from "../components/blocks/AnimalGrid.vue";
import CtaBanner from "../components/blocks/CtaBanner.vue";
import TextImage from "../components/blocks/TextImage.vue";
import SpeciesSelect from "../components/blocks/SpeciesSelect.vue";
</script>
