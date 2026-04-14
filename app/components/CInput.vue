<template>
    <div :class="width === 'full' ? 'col-span-2' : 'col-span-1'" class="input">
      <label class="label" v-if="label"> {{label}}<span class="text-rust-900 ml-1" v-if="required">*</span></label>
      <input :type="type" :required="required" :disabled="disabled" :min="min" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
      <p class="error-message" v-if="error">{{error}}</p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string | number | null
  width: 'full' | 'half'
  type: string
  label?: string | null
  required?: boolean
  disabled?: boolean
  min?: number | string
  error?: string
}>()


const emit = defineEmits<{
  'update:modelValue' : [value:string]
}>()
</script>
