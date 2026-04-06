<template>
  <main class="petmatch-container">
    <PetList :paginate="12" :filters="true" status="available" />
  </main>
</template>
<script setup lang="ts">
import PetList from "../../components/pet/PetList.vue";
</script>
