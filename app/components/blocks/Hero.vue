<template>
  <section class="md:pt-5 lg:pt-10 bg-terrakotta mb-10">
    <div class="md:grid grid-cols-12 gap-4 pawmatch-container relative max-md:!px-0 max-md:!max-w-none max-md:!mx-0">
      <article class="col-span-5 text-white font-inter max-md:absolute inset-0 max-md:bg-bark-500/50 space-y-3 lg:space-y-5 flex flex-col justify-center items-start md:pb-5 lg:pb-10 max-md:px-10">
        <span class="bg-neutral-300/50 px-2 font-bold py-1 text-xs rounded-full">Grenaa Internat</span>
        <h1 class="pr-10 text-2xl lg:text-3xl xl:text-5xl font-bold leading-[1.1] mt-3">Vi finder det perfekte kæle&shy;dyr til dig</h1>
        <p class="pr-10 text-sm lg:text-base max-md:max-w-[500px]">Gå til vores dyrgalleri og filtrer efter dine behov, eller tag vores match quiz - og lad den hjælpe dig finde dit nye familiemedlem. </p>
        <div class="flex items-center space-x-3">
          <Button variant="full" color="white" to="/dyr" class="text-bark-500 md:text-terrakotta-hover hover:bg-white/70">Se alle dyr</Button>
          <Button variant="bordered" color="white" to="/match-quiz" class="hover:text-terrakotta-hover hover:bg-white/70">Tag quizzen</Button>
        </div>
      </article>
      <figure class="col-span-7">
        <NuxtPicture format="webp" src="/hero-image-pawmatch.webp" width="835" height="527" class="[&_img]:!w-full [&_img]:h-auto max-md:[&_img]:object-cover max-md:[&_img]:!min-h-[400px]"/>
      </figure>
    </div>
  </section>
</template>
<script setup lang="ts">
</script>
