<template>
  <div>
    <header class="py-2 bg-white sticky top-0">
      <div class="pawmatch-container flex items-center justify-between">
        <NuxtLink to="/" title="Gå til forside">
          <NuxtImg src="/pawmatch-logo.png" width="150"  alt="PawMatch Logo"/>
        </NuxtLink>
        <nav></nav>
        <Button type="button"
                @click="isAdmin ? navigateTo('/admin') : isLoggedIn ? signOut() : navigateTo('/login')"
                color="dark"
                variant="plain"
                :icon=" UserSvg"
                class="[&_svg]:size-6 [&_svg]:stroke-2 hover:opacity-50" >
             <span :class="!isLoggedIn || isAdmin ? 'hidden' : ''">{{ isLoggedIn && !isAdmin ? 'Log ud' : 'Log ind' }}</span>
        </Button>
      </div>
    </header>
    <slot />
    <footer>

    </footer>
  </div>
</template>
<script setup lang="ts">
import UserSvg from '~/assets/images/icons/user.svg?component'

const { isAdmin, isLoggedIn, signOut } = useAuth()

</script>
