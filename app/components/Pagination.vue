<template>
  <!-- PAGINATION -->
  <div class="flex items-center justify-center gap-2 my-8">
    <button
      :disabled="modelValue === 1"
      class="px-4 py-2 rounded-full bg-bark-300 text-black text-sm disabled:opacity-50"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <
    </button>

    <button
      v-for="p in pages"
      :key="p"
      class="w-9 h-9 rounded-full text-sm font-medium transition-colors"
      :class="p === modelValue
          ? 'bg-terrakotta text-white'
          : 'bg-white text-black'"
      @click="emit('update:modelValue', p)"
    >
      {{ p }}
    </button>

    <button
      :disabled="modelValue === pages"
      class="px-4 py-2 rounded-full bg-bark-300 text-black text-sm disabled:opacity-50"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      >
    </button>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  pages: number
}>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
}>()
</script>
