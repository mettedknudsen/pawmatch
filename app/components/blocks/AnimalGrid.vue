<template>
  <div class="pawmatch-container mb-5">
    <div class="flex items-center justify-between my-3">
      <h2 class="font-medium font-inter text-bark-500 text-lg">Find dit nye kæledyr</h2>
      <Button to="/dyr" :icon="RightSvg" variant="plain" color="dark" icon-position="right" class="hover:text-terrakotta-hover text-base font-inter !p-0" size="lg">Se alle</Button>
    </div>
    <PetList :limit="4" :filters="false" status="available" />
  </div>
</template>

<script setup lang="ts">
import RightSvg from '~/assets/images/icons/arrow-right.svg?component'
</script>
