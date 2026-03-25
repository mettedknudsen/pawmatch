<script setup lang="ts">
const supabase = useSupabaseClient()

const { data: pets, error } = await supabase
  .from('animals')
  .select('*')
  .limit(1)

console.log('Fejl:', error)
</script>

<template>
  <pre>{{ { pets, error } }}</pre>
<div class="font-roboto" v-for="pet in pets" :key="pet.id">
  <h3>{{pet.name}}</h3>
</div>
</template>
