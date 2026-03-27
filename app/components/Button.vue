<template>
  <button :type="type ?? 'button'"
          :disabled="disabled || loading"
          :class="classes"
          @click="emit('click', $event)"
  >
    <!-- loading -->
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <!--  ikon  -->
    <component :is="icon" v-else-if="icon" class="w-4 h-4" />
    <!-- content -->
    <slot />
  </button>
</template>
<script setup lang="ts">
const props = defineProps<{
  icon?: Component | string
  color?: 'primary' | 'secondary' |'success' | 'alert' | 'dark' | 'white'|'black'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  variant?: 'full' | 'bordered' | 'plain',
  type?: 'button' | 'submit' | 'reset'
}>()

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
const variantClasses = computed(() => {
  const v = props.variant ?? 'full'
  const c = props.color ?? 'primary'

  const map = {
    primary: {
      full: 'bg-terrakotta text-white',
      bordered: 'bg-creme border border-terrakotta text-black',
      plain: 'text-terrakotta',
    },
    secondary: {
      full: 'bg-bark-300 text-black',
      bordered: 'border border-bark-300 text-black',
      plain: 'text-black',
    },
    success: {
      full: 'bg-salvie-900 text-white',
      bordered: 'bg-salvie-500 border border-salvie-900 text-salvie-900',
      plain: 'text-salvie-900',
    },
    alert: {
      full: '',
      bordered: '',
      plain: '',
    },
    dark: {
      full: '',
      bordered: '',
      plain: '',
    },
    white: {
      full: '',
      bordered: '',
      plain: '',
    },
    black: {
      full: '',
      bordered: '',
      plain: '',
    },
  }
  return map[c][v]
})

const variants = {
  success: props.variant === 'full' ? 'bg-salvie-900 text-white' : props.variant === 'bordered' ? '' : '',
  alert: props.variant === 'full' ? 'bg-rust-900 text-white' : props.variant === 'bordered' ? 'bg-rust-300 border border-rust-900 text-rust-900' : 'text-rust-900',
  dark: props.variant === 'full' ? 'bg-bark-500 text-white' : props.variant === 'bordered' ? 'border border-bark-900 text-bark-900' : 'text-bark-900',
  white: props.variant === 'full' ? 'bg-white text-black' : props.variant === 'bordered' ? 'border border-white text-white' : 'text-white',
  black: props.variant === 'full' ? 'bg-black text-white' : props.variant === 'bordered' ? 'border border-black text-black' : 'text-black',
}


const sizes = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-5 py-2.5 text-base gap-2',
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-xl border font-medium transition-colors hover:opacity-50',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variants[props.color ?? 'primary'],
  sizes[props.size ?? 'md'],
])
</script>
