<template>
  <main class="pawmatch-container mb-10 min-h-[100vh]">
    <PetList :paginate="12" :filters="true" />
  </main>
</template>
<script setup lang="ts">
import PetList from "../../components/pet/PetList.vue";
</script>
