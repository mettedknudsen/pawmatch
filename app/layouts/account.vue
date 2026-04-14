<template>
  <main class="min-h-screen mx-auto px-3 lg:px-5 py-4 lg:py-10">
    <NuxtLink to="/" title="Gå til forside" class="my-10 w-full flex justify-center">
      <NuxtImg src="/pawmatch-logo.png" width="150"  alt="PawMatch Logo"/>
    </NuxtLink>
    <slot/>
    <div class="flex justify-center">
      <Button type="button" @click="navigateTo('/')" color="dark" variant="plain" :icon="BackSvg" class="mt-5 hover:text-terrakotta-hover" >
        Gå tilbage til forsiden
      </Button>
    </div>
  </main>
</template>
<script setup lang="ts">
import BackSvg from '~/assets/images/icons/back.svg?component'
</script>
