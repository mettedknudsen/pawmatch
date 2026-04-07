<template>
  <div>
    <header class="py-2 bg-white sticky top-0">
      <div class="pawmatch-container flex items-center justify-between">
        <NuxtLink to="/" title="frontpage">
          <img :src="Logo" width="150"  alt="PawMatch Logo"/>
        </NuxtLink>
        <nav></nav>
        <Button type="button" @click="navigateTo('/login')" color="dark" variant="plain" :icon="UserSvg" class="[&_svg]:size-6 [&_svg]:stroke-2 hover:opacity-50" ><span class="hidden">Login</span></Button>
      </div>
    </header>
    <slot />
  </div>
</template>
<script setup lang="ts">
import Logo from '~/assets/images/pawmatch-logo.png'
import UserSvg from '~/assets/images/icons/user.svg?component'

</script>
