<template>
  <section class="pawmatch-container md:grid grid-cols-12 gap-4 items-end max-md:px-0 flex flex-col mb-5 lg:mb-10">
    <div class="col-start-1 col-span-6 lg:col-span-5 lg:col-start-2 bg-salvie-700 row-start-1 relative mb-3 text-light  p-5 xl:pt-10 xl:pb-20 xl:px-7 max-md:order-last max-md:-mt-20 max-md:mx-3">
      <div class="grid grid-cols-5 gap-x-4 mb-4">
        <h3 class="col-span-4 lg:col-span-3 text-2xl xl:text-4xl font-inter font-bold mb-3 lg:mb-6">Basse har ventet 3 år på et nyt hjem</h3>
        <p class="col-span-4 md:col-span-5 lg:col-span-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid cum debitis deserunt dolore doloremque eaque eius error laudantium mollitia nihil?
        </p>
      </div>

      <Button variant="bordered" color="white" to="/dyr/1b2872f9-4fa7-49db-b034-6a1420276b6c" class="hover:bg-white/20">Se hans profil</Button>
    </div>
    <NuxtPicture format="avif" src="/image-text-block-rabbit.avif"
                 class="col-span-8 lg:col-span-7 col-start-5 lg:col-start-6 row-start-1 bg-neutral-300 [&_img]:h-full max-h-[700px] [&_img]:object-cover"/>
  </section>
</template>
<script setup lang="ts">
</script>
