import type {Animal} from '~/types'

export const useQuiz = () => {
  const supabase = useSupabaseClient()

  async function findMatches(answers: Record<string, any>, questions: any[]) {
    let query = supabase.from('animals').select('*').eq('status', 'available')
    if (answers.species && answers.species !== 'all') query = query.eq('species', answers.species)

    const {data: animals} = await query

    // all animals of the selected species
    // time to rank them !
    return (animals ?? [])
      .map(animal => {
        let score = 0
        // total points change dynamically based on species / amount of questions
        let total = 0

        // loop thru all the answers - and transform the (answer) record/object key|values pairs into arrays
        // like answers = {species:'dog', is_hypoallergenic: true} => ["species", "dog"], ['is_hypoallergenic', true]
        // and creating variable names for these values
        for (const [field, answerValue] of Object.entries(answers)) {
          // skip species field
          if (field === 'species') continue
          // looks at same field's value in the current animal in the loop
          const animalValue = animal[field as keyof Animal]
          //if irrelevant skip - also no score for boolean that is false
          if(animalValue === null || animalValue === undefined) continue

          // gotta access the question mode to check animal requirements
          const question = questions.find(q => q.field === field)
          if(!question) continue

          // if animals requirement/needs is not met - give hard penalty score
          if (question?.mode === 'requirement') {
            if (
              (animalValue === true && answerValue === false)
              || (userValue >= animalValue)
              || (userValue === 'small' && animalValue === 'large') ) {
              score -= 10
            }
            continue
          }

          // bool
          if(typeof answerValue === 'boolean') {
            // users needs - if false they dont have a specific need
            // child / allergy / other animals
            if(answerValue === false) continue
            total++

            //  gain one if it does match
            if(answerValue === animalValue) score ++
            // retract point if not matching
            else score--
          }
          // range can give 1 / 0.5 / 0 points - depending on the difference
          else if (typeof answerValue === 'number'){
            total++

            const diff = Math.abs((animalValue as number) - answerValue)
            score += diff === 0 ? 1 : diff== 1 ? 0.5 : 0
          }
          // our enum values gives 1 point if they match
          else if(answerValue === animalValue){
            total++
            score++
          }
        }


        console.log('score;', total > 0 ? score / total : 0)
        // returning new mapped object, now animal + score
        return {
          animal,
          score: total > 0 ? score / total : 0
        }

      })
      .sort((a, b) => b.score - a.score) // high to small
      .slice(0, 3) // top3
  }

  return {findMatches}
}
