import type {Animal} from '~/types'

export const useQuiz = () => {
  const supabase = useSupabaseClient()

  async function findMatches(answers: Record<string, any>) {
    let query= supabase.from('animals').select('*').eq('status', 'available')
    if(answers.species) query = query.eq('species', answers.species)

    const {data:animals} = await query

    return (animals ?? [])

  }
  return {findMatches}
}
