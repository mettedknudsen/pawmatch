<template>
  <section class="max-w-2xl">
    <div class="flex items-end mb-8 max-md:justify-between">
      <h1 class="text-bark-900 text-2xl font-bold ">
        {{ isNew ? 'Tilføj dyr' : 'Rediger dyr'}}
      </h1>
      <Button v-if="!isNew" color="dark" :to="`/dyr/${route.params.id}`" variant="plain" :icon="EyeSvg" class="!text-neutral-500 hover:!text-neutral-500/70 transition max-md:[&_svg]:size-8 !py-0"><span class="max-md:hidden">Se profilen</span></Button>
      <Button to="/admin/dyr" size="sm" class="ml-auto">Gå tilbage</Button>
    </div>
    <form class="p-6 bg-white rounded-2xl border border-neutral-200 space-y-6" @submit.prevent="save">

      <!-- Image | Upload -->
      <div class="input bg-neutral-100/50 p-2 rounded-lg border-2 border-dotted border-neutral-200">
        <p class="label">Billeder</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-5 gap-3">
          <!--  currentImages -preview  -->
          <figure v-for="(url, i) in images" :key="i" class="relative max-w-93">
            <video
              v-if="getFileType(url) === 'video'"
              :src="getImageUrl(url)"
              class="w-full h-full rounded-xl border border-neutral-500 aspect-[4/3] object-cover"
              preload="metadata"
              muted
            />
            <NuxtImg
              v-else
              :src="getImageUrl(url)"
              :alt="`${form.name}-image`"
              width="400"
              height="300"
              fit="contain"
              loading="lazy"
              class="w-full h-full rounded-xl border border-neutral-500"
            />
            <div class="absolute bg-white/50 rounded-lg py-1 px-2 bottom-1 space-x-1 right-1 flex items-center">
              <Button
                v-if="i !== 0"
                type="button" size="sm"
                variant="full" color="white"
                class="hover:bg-terrakotta hover:text-white"
                @click="images = [url, ...images.filter(img => img !== url)]"
              >
                Gør primær
              </Button>
              <span v-else class="bg-terrakotta text-white text-xs px-2 py-1 rounded-lg">
                Primær
              </span>
              <Button
                type="button" variant="bordered"
                color="alert" size="sm"
                class="hover:bg-rust-900 hover:text-white"
                @click="removeExisting(url)"
              >
                Fjern
              </Button>
            </div>
          </figure>
        </div>
        <!--  upload  -->
          <UFileUpload v-model="pendingFiles"
                       accept="image/*, video/*"
                       position="outside" layout="list"
                       multiple label="Upload filer her"
                       class="max-w-93 w-full [&_img]:max-h-12 [&_img]:m-1 [&_img]:max-w-15 [&_*]:data-[slot=file]:bg-white
                       [&_img]:object-cover [&_*]:data-[slot=file]:px-1 [&_*]:data-[slot=fileWrapper]:w-full"
                       :ui="{base: 'min-h-48'}"
          />
          <p class="text-neutral-500 text-xs mt-3">Første billede bruges som det primære billede</p>
        </div>


      <!-- Name | species -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="input">
          <label class="label mb-1">Navn<span class="text-rust-900 ml-1">*</span></label>
          <UInput v-model="form.name" required type="text" class="w-full" />
        </div>

        <div class="input">
          <label class="label mb-1">Type</label>
          <USelect class="w-full"  v-model="form.species" :items="[
            {label: 'Hund', value: 'dog' },
            {label: 'Kat', value: 'cat'},
            {label: 'Kanin', value: 'rabbit'}]"
          />
        </div>
      </div>

      <!-- Race | gender -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="input">
          <label class="label mb-1">Race</label>
          <UInput v-model="form.breed" type="text" class="w-full" />
        </div>

        <div class="input">
          <label class="label mb-1">Køn</label>
          <USelect class="w-full"  v-model="form.gender" :items="[
            {label: 'Hun', value: 'female' },
            {label: 'Han', value: 'male'}
            ]"
          />
        </div>
      </div>

      <!-- Age | Size -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="input">
          <label class="label mb-1">Alder (år - måneder)</label>
          <div class="flex items-center gap-1">
            <UInput v-model="ageYears" type="number" class="flex-1" />
            <UInput v-model="ageMonths" type="number" class="flex-1" />
          </div>
        </div>

        <div class="input">
          <label class="label mb-1">Størrelse</label>
          <USelect class="w-full"  v-model="form.size" :items="[
            {label: 'Lille', value: 'small' },
            {label: 'Mellem', value: 'medium' },
            {label: 'Stor', value: 'large'}
            ]"
          />
        </div>
      </div>
      <!-- Cage | status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="input">
          <label class="label mb-1">Bur / lokation</label>
          <UInput v-model="form.cage" type="text" class="w-full" />
        </div>

        <div class="input">
          <label class="label mb-1">Status</label>
          <USelect class="w-full"  v-model="form.status" :items="[
            {label: 'Ledig', value: 'available' },
            {label: 'Reserveret', value: 'reserved' },
            {label: 'Adopteret', value: 'adopted'}
            ]"
          />
        </div>
      </div>


      <!-- Description -->
      <div class="input">
        <label class="label mb-1">Beskrivelse</label>

        <UEditor v-slot="{ editor }" v-model="form.description" content-type="json" class="w-full max-lg:px-2 py-2 [*_p]:!text-xs border border-neutral-300 rounded-xl min-h-[150px]" :placeholder="{ placeholder: 'Skriv en beskrivelse her...', mode: 'firstLine' }">
          <UEditorToolbar class="border-b border-neutral-300 mb-3 pb-1 px-4" :editor="editor" :items="toolbarItems"/>
        </UEditor>
      </div>

      <!-- Checkboxes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-10">
        <label v-for="box in [
          {key: 'good_with_children', label: 'God med børn' },
          {key: 'good_with_animals', label: 'God med dyr'},
          {key: 'is_hypoallergenic',label: 'Allergivenlig' },
          {key: 'needs_outdoor',  label: 'Kræver adgang til have' },
          {key: 'is_neutered', label: 'Kastreret/steriliseret'},
        ]" :key="box.key" class="flex items-center gap-2 text-sm">
          <UCheckbox v-model="form[box.key]" class="size-4 accent-terrakotta-hover" />
          {{ box.label }}
        </label>
      </div>

      <!-- Ranges -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-10">
        <label v-for="range in [
          {key: 'independence_level', label: 'Selvstændighed', '1': 'Krævende', '2': 'Moderat', '3':'Meget'},
          {key: 'shedding_level', label: 'Pels fælder', '1': 'Minimalt', '2': 'Moderat', '3':'Meget'},
          {key: 'grooming_level',label: 'Pelspleje' , '1': 'Minimalt', '2': 'Mellem', '3':'Krævende'},
          {key: 'activity_level',  label: 'Aktivitetsniveau', '1': 'Lavt', '2': 'Mellem', '3':'Højt' },
          {key: 'handling_tolerance', label: 'Tolerance for at blive holdt', '1': 'Lav', '2': 'Mellem', '3':'Høj'},
        ]" :key="range.key" class="">
          <span class=" mb-2">
            {{ range.label }}
          </span>
          <span class="float-right mb-2">
          {{ range[form[range.key]] }}
          </span>
          <USlider v-model="form[range.key]" :step="1" :min="1" :max="3" size="xl" class="[&_span]:data-[slot=thumb]:size-3" />
        </label></div>

      <Button type="submit" :loading="loading" class="hover:bg-terrakotta-hover">
        {{ isNew ? 'Opret dyr' : 'Gem ændringer' }}
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import EyeSvg from '~/assets/images/icons/eye.svg?component'
import type { EditorToolbarItem } from '@nuxt/ui'

definePageMeta({ layout: 'admin' })
const route  = useRoute()
const supabase = useSupabaseClient()
const {uploadImages, getImageUrl, getFileType} = useStorage()

const isNew = route.params.id === 'opret'

const form = reactive({
  name: '',
  species: 'dog',
  status: 'available',
  cage: '',
  description: '',
  breed: '',
  gender: 'male',
  shedding_level: 1,
  grooming_level: 1,
  activity_level: 2,
  independence_level: 2,
  handling_tolerance: 2,
  space_needed: 'medium',
  size: 'medium',
  personality: 'calm',
  images: [],
  good_with_children: true,
  good_with_animals: true,
  is_hypoallergenic: false,
  needs_outdoor:false,
  is_neutered:false
})

const toolbarItems: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
  { kind: 'heading', level: 3, icon: 'i-lucide-heading-3' },
  { kind: 'bulletList', icon: 'i-lucide-list' },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote', icon: 'i-lucide-quote' },
  { kind: 'link', icon: 'i-lucide-link' }
]

const ageYears = ref(0)
const ageMonths = ref(0)

// Getting the animal by id / slug
if (!isNew) {
  const { data } = await supabase
    .from('animals')
    .select('*')
    .eq('id', route.params.id)
    .single()
  // console.log(data)
  if (data){
    Object.assign(form, data)
    ageYears.value = Math.floor((data.age_months ?? 0)/12)
    ageMonths.value = (data.age_months ?? 0) % 12
  }
}
const images = ref<string[]>(form.images ?? [])
const loading = ref(false)
const pendingFiles = ref<File[]>([])

async function removeExisting(url: string) {
  if (!confirm('Fjern dette billede?')) return
  images.value = images.value.filter(i => i !== url)
}

async function save() {
  loading.value = true

  try {
    // Upload files first
    const newUrls = pendingFiles.value.length > 0 ? await uploadImages(pendingFiles.value) : []

    const allImages = [...images.value, ...newUrls]
    const totalMonths = (ageYears.value * 12) + ageMonths.value

    const payload = {
      ...form,
      age_months: totalMonths,
      images: allImages
    }

    if (isNew) {
      // add new animal
      await supabase.from('animals').insert(payload)
    } else {
      // edit animal - append the pending files to the images field
      await supabase.from('animals').update(payload).eq('id', route.params.id)
    }

    navigateTo('/admin/dyr')
  } finally {
    loading.value = false
  }
}
</script>
