export function useStorage() {
  const supabase = useSupabaseClient()
  function getImageUrl(path: string) {
    const { data } = supabase.storage
      .from('animals')
      .getPublicUrl(path)
    return data.publicUrl
  }
  async function uploadImage(file: File, filename: string) {
    const { data, error } = await supabase.storage
      .from('animals')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true
      })
    if (error) throw error
    return getImageUrl(data.path)
  }

  return { getImageUrl, uploadImage }
}
