<template>
  <main v-if="pet" class="mt-10">
    <div class="pawmatch-container flex flex-col lg:grid grid-cols-12 min-h-[100vh-100px] mb-10 md:mb-20">
      <!--  Content  -->
      <section class="col-span-5">
        <div class="hidden md:flex md:space-x-7 items-center max-lg:justify-between mb-10 max-lg:mt-10">
          <h1 class="text-2xl font-bold font-inter" v-if="pet.name">{{ pet.name }}</h1>

          <div class="h-10 relative flex items-center justify-center p-1" v-if="pet.status === 'available'">
            <div class="bg-rust-500/80 rounded-xl animate-pulse absolute inset-0">
            </div>
            <Button color="alert" variant="full" class="hover:opacity-70 relative"
                    :to="{path:'/booking', query:{dyr: pet.id}}">Mød mig
            </Button>
          </div>
          <div v-else-if="pet.status === 'reserved'"
               class="bg-bark-300 border text-bark-500/80 px-2 py-0.5 text-sm rounded-full">
            <span>Reserveret</span>
          </div>
          <div v-else class="bg-rust-300 border text-rust-900 border-rust-500 px-2 py-0.5 text-sm rounded-full">
            <span>Adopteret</span>
          </div>
        </div>
        <UEditor v-if="pet.description" content-type="json" v-model="pet.description" :editable="false"
                 class="formatting [&_div]:!p-0 py-10 lg:pt-0"/>
        <p class="py-10 lg:pt-0" v-else>Beskrivelse på vej</p>
      </section>
      <!--  Image  -->
      <div class="col-span-6 col-start-7 max-lg:order-first">
        <div class="flex md:space-x-7 items-center max-md:justify-between mb-10 md:hidden">
          <h1 class="text-2xl font-bold font-inter" v-if="pet.name">{{ pet.name }}</h1>
          <div class="h-10 relative flex items-center justify-center p-1">
            <div class="bg-rust-500/80 rounded-xl animate-pulse absolute inset-0" v-if="pet.status === 'available'">
            </div>
            <Button type="button" color="alert" variant="full" class="hover:opacity-70 relative"
                    v-if="pet.status === 'available'"
                    :to="{path:'/booking', query:{dyr: pet.id}}">Mød mig
            </Button>
            <div v-else-if="pet.status === 'reserved'"
                 class="bg-bark-300 border text-bark-500/80 px-2 py-0.5 text-sm rounded-full">
              <span>Reserveret</span>
            </div>
            <div v-else class="bg-rust-300 border text-rust-900 border-rust-500 px-2 py-0.5 text-sm rounded-full">
              <span>Adopteret</span>
            </div>
          </div>

        </div>
        <figure class="relative  max-md:pb-8">
          <template v-if="images.length > 1">
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <template v-for="(url, i) in images" :key="i">
                <video
                  v-if="getFileType(url) === 'video'"
                  :src="getImageUrl(url)"
                  class="w-full object-cover absolute inset-0 transition-opacity h-full duration-300"
                  :class="i === currentIndex ? 'opacity-100' : 'opacity-0'"
                  controls
                  playsinline
                  preload="metadata"
                />
                <NuxtImg
                  v-else
                  :src="getImageUrl(url)"
                  :alt="pet.name"
                  width="800"
                  fit="cover"
                  loading="lazy"
                  class="w-full object-cover rounded-lg absolute inset-0 transition-opacity duration-300 h-full [&_img]:object-cover [&_img]:w-full"
                  :class="i === currentIndex ? 'opacity-100' : 'opacity-0'"
                />
              </template>
            </div>
            <div class="flex flex-wrap max-md:justify-center items-center gap-4 md:gap-2 md:absolute md:-bottom-10 max-md:mt-5 md:right-0">
              <!--  prev  -->
              <button type="button"
                      :disabled="currentIndex === 0"
                      class="flex items-center justify-center [&_svg]:!size-6 md:[&_svg]:!size-5  size-10 md:size-7 rounded-full bg-bark-300 text-bark-900 shadow-sm disabled:opacity-50"
                      @click="currentIndex --">
                <LeftSvg/>
              </button>
              <!--  choose by index  -->
              <button
                type="button"
                v-for="(file, i) in images"
                :key="i"
                :class="i === currentIndex ? 'bg-terrakotta text-white' : 'text-bark-900 bg-white'"
                class="flex items-center justify-center [&_svg]:!size-6 md:[&_svg]:!size-5  size-10 md:size-7 rounded-full shadow-sm"
                @click="currentIndex = i"
              >
                <VideoSvg v-if="getFileType(file) === 'video'"/>
                <ImgSvg v-if="getFileType(file) === 'image'"/>
              </button>
              <!--  next  -->
              <button
                :disabled="currentIndex === (images.length - 1)"
                class="flex items-center justify-center [&_svg]:!size-6 md:[&_svg]:!size-5  size-10 md:size-7 rounded-full bg-bark-300 text-bark-900 shadow-sm disabled:opacity-50"
                @click="currentIndex ++">
                <RightSvg/>
              </button>
            </div>
          </template>
          <template v-else-if="images.length === 1">
          <video
            v-if="getFileType(images[0]) === 'video'"
            :src="getImageUrl(images[0])"
            class="w-full object-cover rounded-2xl aspect-video"
            controls
            playsinline
            preload="metadata"
          />
          <NuxtImg
            v-else
            :src="getImageUrl(images[0])"
            :alt="pet.name"
            width="800"
            fit="cover"
            loading="lazy"
            class="w-full object-cover rounded-lgrounded-2xl md:min-h-100  h-full"
          />
          </template>
          <div v-else
               class="w-full object-cover aspect-[1.33] flex flex-col items-center justify-center rounded-lg bg-gray-300">
            <imgSvg class="w-16 h-16 mb-3"/>
            <p>Billede er på vej</p>
          </div>
        </figure>
      </div>
    </div>

    <!--  Details  -->
    <div class="bg-white pb-10">
      <section class="pawmatch-container max-md:py-5 py-10 lg:grid grid-cols-2 gap-4">
        <div class="flex items-center justify-between mb-5 col-span-2">
          <h2 class="text-lg font-bold font-inter">Flere informationer<span v-if="pet.name" class="hidden lg:inline"> om {{
              pet.name
            }}</span>
          </h2>
          <div class="h-10 relative flex items-center justify-center p-1" v-if="pet.status === 'available'">
            <div class="bg-rust-500/80 rounded-xl animate-pulse absolute inset-0">
            </div>
            <Button color="alert" variant="full" class="hover:opacity-70 relative"
                    :to="{path:'/booking', query:{dyr: pet.id}}">Mød {{ pet.name }}
            </Button>
          </div>
        </div>
        <ul class="col-span-2 flex flex-wrap">
          <li v-for="item in attributes" :key="item.key"
              class="max-lg:w-full lg:flex-1/2 py-2 space-x-2 px-2 [&:not(:last-child)]:[&>div]:border-b">
            <div class="pb-4 flex items-center max-lg:justify-between lg:space-x-4 border-rust-900">
              <strong>{{ item.label }}:</strong>
              <span class="capitalize text-right">{{ item.value }}</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </main>


</template>
<script setup lang="ts">
import ImgSvg from '~/assets/images/icons/img.svg?component'
import VideoSvg from '~/assets/images/icons/video.svg?component'
import LeftSvg from '~/assets/images/icons/arrow-left.svg?component'
import RightSvg from '~/assets/images/icons/arrow-right.svg?component'
import {useStorage} from "../../composables/useStorage";
import {useFormat} from "../../composables/useFormat";
import {useAnimalMetaData} from "../../composables/useAnimalMetaData";

const {gender, personality} = useAnimalMetaData()
const {getImageUrl, getFileType} = useStorage()
const {age, timeInShelterSimple} = useFormat()
const supabase = useSupabaseClient()
const route = useRoute()
const id = route.params.id

const {data: pet, error} = await supabase
  .from('animals')
  .select('*')
  .eq('id', id)
  .single()
// console.log(pet)
if (error) console.log('Fejl:', error)
if (error || !pet) {
  throw createError({
    status: 404,
    statusText: 'Dyr ikke fundet',
    fatal: true
  })
}

const currentIndex = ref(0)

const images = computed(() => {
  return pet?.images ?? []
})

const attributes = computed(() => {
  if (!pet) return

  return [
    {
      key: 'gender',
      label: 'Køn',
      value: gender[pet.gender],
    },
    {
      key: 'age_months',
      label: 'Alder',
      value: age(pet.age_months, pet.created_at),
    },
    {
      key: 'breed',
      label: 'Race',
      value: pet.breed,
    },
    {
      key: 'size',
      label: 'Størrelse',
      value: pet.size === 'large' ? 'Stor' : pet.size === 'medium' ? 'Mellem' : 'Lille',
    },
    {
      key: 'personality',
      label: 'Personlighed',
      value: personality[pet.personality],
    },
    {
      key: 'activity_level',
      label: 'Aktivitetsniveau',
      value: pet.activity_level === 3 ? 'Højt' : pet.activity_level === 2 ? 'Mellem' : 'Lavt',
    },
    {
      key: 'shedding_level',
      label: 'Pels fælder',
      value: pet.shedding_level === 3 ? 'Meget' : pet.shedding_level === 2 ? 'Moderat' : 'Minimalt',
    },
    {
      key: 'good_with_children',
      label: 'Børnevenlig',
      value: pet.good_with_children ? 'Ja' : 'Nej',
    },
    {
      key: 'good_with_animals',
      label: 'God med andre dyr',
      value: pet.good_with_animals ? 'Ja' : 'Nej',
    },
    {
      key: 'is_hypoallergenic',
      label: 'Allergivenlig',
      value: pet.is_hypoallergenic ? 'Ja' : 'Nej',
    },
    {
      key: 'needs_outdoor',
      label: 'Kræver udeareal',
      value: pet.needs_outdoor ? 'Ja' : 'Nej'
    },

    {
      key: 'independence_level',
      label: 'Selvstændighed',
      value: pet.independence_level === 3 ? 'Meget selvstænding' : pet.independence_level === 2 ? 'Moderat selvstændig' : 'Kræver meget opmærksomhed'
    },

    {
      key: 'space_needed',
      label: 'Pladskrav',
      value: pet.space_needed === 'large' ? 'Stort' : pet.space_needed === 'medium' ? 'Mellem' : 'Lavt'
    },

    {
      key: 'handling_tolerance',
      label: 'Tolerance for at blive holdt',
      value: pet.handling_tolerance === 3 ? 'Høj' : pet.handling_tolerance === 2 ? 'Mellem' : 'Lav'
    },

    {
      key: 'is_neutered',
      label: 'Kastreret / steriliseret',
      value: pet.is_neutered ? 'Ja' : 'Nej'
    },
    {
      key: 'grooming_level',
      label: 'Pelspleje',
      value: pet.grooming_level === 3 ? 'Krævende' : pet.grooming_level === 2 ? 'Mellem' : 'Minimalt'
    },
    {
      key: 'cage',
      label: 'Lokaliseret i',
      value: pet.cage
    },
    {
      key: 'created_at',
      label: 'Tid ved os',
      value: timeInShelterSimple(pet.created_at)
    }
  ].filter(item => item.value !== null && item.value !== undefined && item.value !== '') // Filtrer tomme væk
})

</script>
