<template>
  <component :is="isLink ? NuxtLink : 'button'"
  :to="to || undefined"
  :disabled="!isLink ? isDisabled : undefined"
  :type="!isLink ? (type ?? 'button') : undefined"
  :class="[classes,variantClasses]"
  @click="!isLink && !isDisabled ? emit('click', $event) : undefined"
  >
    <!-- loading -->
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <!--  ikon  -->
    <component :is="icon" v-else-if="icon && iconPosition !== 'right'" class="w-4 h-4" />
    <!-- content -->
    <slot />
    <component :is="icon" v-if="icon && iconPosition === 'right'" class="w-4 h-4" />
  </component>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  icon?: Component | string
  color?: 'primary' | 'secondary' |'success' | 'alert' | 'dark' | 'white'|'black'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  variant?: 'full' | 'bordered' | 'plain',
  type?: 'button' | 'submit' | 'reset',
  to?: string | RouteLocationRaw | null
  iconPosition?: 'left' | 'right'
}>()
const isLink = computed(() => !!props.to)
const isDisabled = computed(() => props.disabled || props.loading)
const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
const variantClasses = computed(() => {
  const v = props.variant ?? 'full'
  const c = props.color ?? 'primary'

  const map = {
    primary: {
      full: 'bg-terrakotta text-white hover:bg-terrakotta-hover border border-terrakotta',
      bordered: 'bg-creme border border-terrakotta text-black hover:text-terrakotta-hover',
      plain: 'text-terrakotta hover:text-terrakotta-hover',
    },
    secondary: {
      full: 'bg-bark-300 text-black border border-bark-300',
      bordered: 'border border-bark-300 text-black',
      plain: 'text-black',
    },
    success: {
      full: 'bg-salvie-900 text-white border border-salvie-900',
      bordered: 'bg-salvie-500 border border-salvie-900 text-salvie-900',
      plain: 'text-salvie-900',
    },
    alert: {
      full: 'bg-rust-900 text-white border border-rust-900 hover:bg-rust-900-hover',
      bordered: 'bg-rust-300 border border-rust-900 text-rust-900',
      plain: 'text-rust-900',
    },
    dark: {
      full: 'bg-bark-500 text-white border border-bark',
      bordered: 'border border-bark-900 text-bark-900 hover:text-white hover:bg-bark-500',
      plain: 'text-bark-900',
    },
    white: {
      full: 'bg-white text-black border border-white',
      bordered: 'border border-white text-white',
      plain: 'text-white',
    },
    black: {
      full: 'bg-black text-white border border-black',
      bordered: 'border border-black text-black',
      plain: 'text-black',
    },
  }
  return map[c][v]
})


const sizes = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-5 py-2.5 text-base gap-2',
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-lg font-medium transition',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  sizes[props.size ?? 'md'],
])
</script>
