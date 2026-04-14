<template>
  <section class="min-h-screen px-4 flex items-center justify-center">
    <div class="lg:min-h-[500px] pawmatch-container w-full bg-white text-center flex flex-col justify-center items-center gap-5 lg:gap-10 py-20">
    <h1 class="text-4xl lg:text-7xl text-bark-500 font-roboto">{{props.error.status}}</h1>
    <p class="text-lg lg:text-xl text-neutral-500 font-roboto">{{props.error.statusText}}</p>
    <Button @click="handleError">
      Gå tilbage
    </Button>
    </div>
  </section>
</template>
<script setup lang="ts">
import type {NuxtError} from "#app";
const props = defineProps<{error: NuxtError}>()
const handleError = () => clearError({ redirect: '/' })
</script>
