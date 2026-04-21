<template>
  <main class="grid grid-cols-12">
    <div class="col-span-12 pawmatch-container">
      <div class="flex items-center justify-between my-3">
      <h2 class="font-medium font-roboto text-bark-500 lg:text-lg">Find dit nye kæledyr</h2>
      <Button to="/dyr" :icon="RightSvg" variant="plain" color="dark" icon-position="right" class="hover:text-terrakotta-hover lg:text-base font-roboto">Se alle</Button>
      </div>
      <PetList :limit="4" :filters="false" status="available" />
    </div>
  </main>
</template>
<script setup lang="ts">
import RightSvg from '~/assets/images/icons/arrow-right.svg?component'
</script>
