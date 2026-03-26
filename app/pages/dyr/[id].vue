<template>
  <pre>
{{pet}}
  </pre>
</template>
<script setup lang="ts">
import {useStorage} from "../../composables/useStorage";
import {useFormat} from "../../composables/useFormat";
const { getImageUrl } = useStorage()
const { age, timeInShelter } = useFormat()
const supabase = useSupabaseClient()
const route = useRoute()
const id = route.params.id

const { data: pet, error } = await supabase
  .from('animals')
  .select('*')
  .eq('id', id)
  .single()
if (error) console.log('Fejl:', error)

</script>
