<template>
  <section class="max-w-2xl">
    <h1 class="text-bark-900 mb-8 text-2xl font-bold ">
      {{ isNew ? 'Tilføj dyr' : 'Rediger dyr'}}
    </h1>

    <form class="p-6 bg-white rounded-2xl border border-neutral-200 space-y-6" @submit.prevent="save">

      <!-- Image | Upload -->
      <div class="input bg-terrakotta/10 p-2 rounded-lg border border-dotted border-neutral-200">
        <p class="label">Billeder</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-5 gap-3">
          <!--  currentImages  -->
          <figure v-for="(url, i) in images" :key="url" class="relative max-w-93">
            <NuxtImg
              :src="getImageUrl(url)"
              :alt="`${form.name}-image-${i}`"
              width="400"
              height="300"
              fit="contain"
              loading="lazy"
              class="w-full h-full rounded-xl"
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
          <UFileUpload @change="onFilesChange"
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

      <!-- Age | status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="input">
          <label class="label mb-1">Alder (måneder)</label>
          <UInput v-model="form.age_months" type="text" class="w-full" /> <!-- TODO: change to two fields calc the months -->
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
        <UTextarea v-model="form.description" rows="4" class="w-full" placeholder="Skriv en beskrivelse her"/>
      </div>

      <!-- Checkboxes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

      <Button type="submit" :loading="loading" class="hover:bg-terrakotta-hover">
        {{ isNew ? 'Opret dyr' : 'Gem ændringer' }}
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route  = useRoute()
const supabase = useSupabaseClient()
const {uploadImages, getImageUrl} = useStorage()

const isNew = route.params.id === 'opret'

const form = reactive({
  name: '',
  species: 'dog',
  status: 'available',
  description: '',
  breed: '',
  age_months: 0,
  gender: 'male',
  shedding_level: 1,
  grooming_level: 1,
  activity_level: 2,
  size: 'medium',
  personality: 'calm',
  images:'',
  good_with_children: true,
  good_with_animals: true,
  is_hypoallergenic: false,
  needs_outdoor:false,
  is_neutered:false
})

// Getting the animal by id | if not in edit page
if (!isNew) {
  const { data } = await supabase
    .from('animals')
    .select('*')
    .eq('id', route.params.id)
    .single()
  console.log(data)
  if (data) Object.assign(form, data)
}

const images = ref<string[]>(form.images ?? [])
const loading = ref(false)
const pendingFiles = ref<File[]>([])

function onFilesChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  pendingFiles.value.push(...files)
}

async function removeExisting(url: string) {
  if (!confirm('Fjern dette billede?')) return
  images.value = images.value.filter(i => i !== url)
}

async function save() {
  loading.value = true

  try {

    const newUrls = pendingFiles.value.length > 0
      ? await uploadImages(pendingFiles.value) : []

    const allImages = [...images.value, ...newUrls]

    if (isNew) {
      // add new animal
      await supabase.from('animals').insert(form)
    } else {
      // edit animal - append the pending files to the images field
      await supabase.from('animals').update({...form, images: allImages}).eq('id', route.params.id)
    }

    navigateTo('/admin/dyr')
  } finally {
    loading.value = false
  }
}
</script>
