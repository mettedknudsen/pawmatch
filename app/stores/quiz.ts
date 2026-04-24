import {quizData} from '~/data/quiz'
import { defineStore } from 'pinia'
import type {Animal} from '~/types'

export const useQuizStore = defineStore('quiz',  () => {
  // STATES (refs) - values can be changed outside of store
  const answers = ref<Record<string, any>>({})
  const species = ref<string | null>(null)
  const results = ref<{ animal: Animal, score: number }[]>([])
  const loading = ref(false)

  const currentStep = ref(0)


  // GETTERS (computed) - calculated values - cannot be manipulated directly
  const questions = computed(() => {
    // if species not selected return species pref question
    const speciesQ = [...quizData.species]
    if (!species.value) return speciesQ
    // else return shared + species questions
    return [
      ...quizData.shared,
      ... (
        species.value === 'dog' ? quizData.dog :
        species.value === 'cat' ? quizData.cat :
        species.value === 'rabbit' ? quizData.rabbit
      : [])
    ]
  })

  const totalSteps  = computed(() => questions.value.length)

  // get current question object by index (current step)
  const currentQuestion = computed(() => questions.value[currentStep.value])


  // ACTIONS (functions)
  function answer (value: any){
    // question object
    const q = currentQuestion.value
    // console.log(currentStep.value, species.value, q)

    // add answer value to answers record - animal field as key
    answers.value[q.field] = value

    // set species value to get the relevant questions
    if (q.type === 'species') species.value = value
    // inc the step
    if(currentStep.value < totalSteps.value && q.type !== 'species') currentStep.value++

    // console.log(currentStep.value, species.value, q)
  }

  function back () {
      if(currentStep.value > 0) currentStep.value--
  }

  function reset(){
    species.value = null
    answers.value = {}
    results.value = []
    currentStep.value = 0
  }

  return { answers, species, results, loading, questions, currentStep, totalSteps, answer, back, reset }
})
