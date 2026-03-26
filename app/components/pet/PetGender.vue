<script setup lang="ts">
import MaleSvg from '~/assets/images/icons/male.svg?component'
import FemaleSvg from '~/assets/images/icons/female.svg?component'

const props = defineProps<{
  gender: string
}>()

const icons: Record<string, Component> = {
  male: MaleSvg,
  female: FemaleSvg,
}

const icon = computed(() => icons[props.gender])
</script>

<template>
  <component :is="icon" v-if="icon" v-bind="$attrs" :class="gender === 'male' ? 'text-male' : 'text-rust-900'" />
</template>
