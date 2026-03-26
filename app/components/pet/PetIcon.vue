<script setup lang="ts">
import DogSvg from '~/assets/images/icons/dog.svg?component'
import CatSvg from '~/assets/images/icons/cat.svg?component'
import RabbitSvg from '~/assets/images/icons/rabbit.svg?component'

const props = defineProps<{
  species: string
}>()

const icons: Record<string, Component> = {
  dog: DogSvg,
  cat: CatSvg,
  rabbit: RabbitSvg,
}

const icon = computed(() => icons[props.species])
</script>

<template>
  <component :is="icon" v-if="icon" v-bind="$attrs" />
</template>
