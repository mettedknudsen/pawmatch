<script setup lang="ts">
</script>

<template>
  <main class="grid grid-cols-12">
    <div class="col-span-12 pawmatch-container">
      <nuxt-link to="/dyr">Se alle</nuxt-link>
      <PetList :limit="4" :filters="false" />
    </div>
  </main>

</template>
