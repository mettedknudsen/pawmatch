<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'da'
  }
})

const title = 'PawMatch'
const description = 'Adopter dit kæledyr her.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
  // ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
})
</script>

<template>
  <UApp>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  </UApp>
</template>
