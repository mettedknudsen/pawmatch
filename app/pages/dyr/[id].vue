<template>
  <main v-if="pet" class="my-10">
    <div class="pawmatch-container flex flex-col lg:grid grid-cols-12">
      <article class="col-span-5">
        <h1>{{pet.name}}</h1>
        <p>{{pet.description}}</p>
      </article>
      <figure class="col-span-6 col-start-7 max-lg:order-first">
        <NuxtImg
          v-if="pet.images.length > 0"
          :src="getImageUrl(pet.images[0])"
          :alt="pet.name"
          width="400"
          height="300"
          fit="cover"
          loading="lazy"
          class="w-full object-cover rounded-lg"
        />
        <div v-else class="w-full object-cover aspect-[1.33] flex items-center justify-center rounded-lg"
             :class="pet.species === 'dog' ? 'bg-bark-300 text-bark-500' : (pet.species === 'cat' ? 'bg-rust-500 text-rust-900 ' : 'bg-salvie-300 text-salvie-900')">
          <PetIcon v-if="pet.species" :species="pet.species" class="w-16 h-16"/>
        </div>
      </figure>
    </div>
<!--  Details  -->
    <section class="bg-white">
      <div class="pawmatch-container">

      </div>
    </section>
  </main>


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
