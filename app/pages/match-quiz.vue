
<script setup lang="ts">
import DogSvg from '~/assets/images/icons/dog.svg?component'
import CatSvg from '~/assets/images/icons/cat.svg?component'
import RabbitSvg from '~/assets/images/icons/rabbit.svg?component'

const quiz = useQuizStore()
const { findMatches } = useQuiz()

const iconMap: Record<string, any> = {
  dog: DogSvg, cat: CatSvg, rabbit: RabbitSvg
}

async function handleAnswer(value: any) {
  quiz.answer(value)

  console.log(quiz.currentStep, quiz.totalSteps, quiz.currentStep >= quiz.totalSteps)
  // last question - time to find the results
  if (quiz.currentStep >= quiz.totalSteps - 1) {
    quiz.loading = true
    quiz.results = await findMatches(quiz.answers)
    quiz.loading = false
  }

}
</script>

<template>
<pre>
  {{quiz.currentStep}}
  {{quiz.totalSteps}}
</pre>
  <main class="pawmatch-container py-10 max-w-2xl mx-auto">
    <div v-if="quiz.results.length">
      <p>SUCCES</p>
      {{quiz.results[0]}}
    </div>
    <div v-else>
      <div v-if="quiz.questions[quiz.currentStep]">
        <h2>{{ quiz.questions[quiz.currentStep].question }}</h2>
        <div class="flex space-x-2">
          <UButton v-for="option in quiz.questions[quiz.currentStep].options"
                   :class="option.classes"
                   :icon="iconMap[option.icon]"
                   @click="handleAnswer(option.value)"
          >
            {{option.label}}
          </UButton>
        </div>
      </div>

    </div>
  </main>
  <pre>
<!--    {{quiz.species}}-->
<!--    {{quiz.answers?.species}}-->
<!--  {{quiz.questions}}-->
  </pre>
</template>

<style scoped>

</style>

