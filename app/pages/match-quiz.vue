
<script setup lang="ts">
import DogSvg from '~/assets/images/icons/dog.svg?component'
import CatSvg from '~/assets/images/icons/cat.svg?component'
import RabbitSvg from '~/assets/images/icons/rabbit.svg?component'
import PetCard from "../components/pet/PetCard.vue";

const quiz = useQuizStore()
const { findMatches } = useQuiz()

const iconMap: Record<string, any> = {
  dog: DogSvg, cat: CatSvg, rabbit: RabbitSvg
}

async function handleAnswer(value: any) {
  quiz.answer(value)

  console.log(quiz.currentStep, quiz.totalSteps, quiz.currentStep >= quiz.totalSteps)
  // last question - time to find the results
  if (quiz.currentStep >= quiz.totalSteps) {
    quiz.loading = true
    quiz.results = await findMatches(quiz.answers, quiz.questions)
    quiz.loading = false
  }

}
</script>

<template>

  <main class="pawmatch-container min-h-[70vh] flex items-center justify-center my-10">
    <section v-if="quiz.results.length">
      <div class="relative">
        <h1 class="text-2xl font-bold text-bark-900 mb-2 font-roboto">Dine matches</h1>
        <p class="text-neutral-500 mb-8">Baseret på dine svar har vi fundet disse dyr til dig</p>
        <Button type="button" @click="quiz.reset()" size="sm" class="absolute right-0 top-0">Tag quiz igen</Button>
      </div>
        <div class="md:grid grid-cols-2 xl:grid-cols-3 gap-4 max-md:space-y-4">
        <article
          v-for="({ animal, percent }, i) in quiz.results" :key="i" class="relative">
          <PetCard
            :pet="animal"
          />
          <div
              :class="percent >= 70 ? 'bg-salvie-900' : (percent >= 50) ? ' bg-terrakotta-hover' : 'bg-rust-300 !text-bark-900'"
              class="absolute text-white top-2 right-2 size-10 flex items-center justify-center rounded-full border-2 border-dotted">
              <span class="size-8 font-bold font-inter text-xs flex items-center justify-center">
                {{percent}}%
              </span>
          </div>
          <div class="absolute top-2 left-2">
            <Button :to="{path:'/booking', query:{dyr: animal.id}}" color="alert" class="shadow-lg">Book en tid</Button>
          </div>
        </article>
        </div>
    </section>
    <div v-else-if="!quiz.loading">
      <div v-if="quiz.questions[quiz.currentStep]" class="flex flex-col justify-center items-center">

          <h2 class="font-inter font-medium text-xl mb-10">{{ quiz.questions[quiz.currentStep].question }}</h2>

        <div class="flex flex-col gap-2">
          <UButton v-for="option in quiz.questions[quiz.currentStep].options"
                   :class="option.classes"
                   :icon="iconMap[option.icon] ?? option.icon"
                   @click="handleAnswer(option.value)"
                   size="lg"
                   class="lg:min-w-32 flex items-center justify-center"
          >
            {{option.label}}
          </UButton>
        </div>
          <Button type="button" @click="quiz.currentStep === 0 ?  quiz.reset() : quiz.back()" size="sm" variant="bordered" class="mt-10" v-if="quiz.species">
            {{ quiz.currentStep === 0 ? 'Start forfra' : 'Gå tilbage' }}
          </Button>
      </div>

      <div v-else class="text-center py-20">
        <div class="w-10 h-10 border-4 border-t-terrakotta border-neutral-200 rounded-full animate-spin mx-auto mb-4" />
        <p class="text-neutral-500">Finder dine matches...</p>
      </div>

    </div>
  </main>

</template>


