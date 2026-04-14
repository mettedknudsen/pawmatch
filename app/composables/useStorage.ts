import * as path from "node:path";

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
        upsert: false
      })
    if (error) throw error
    return getImageUrl(data.path)
  }
  // for multiple files
  async function uploadImages(files: File[]) {
    const uploads = files.map(file =>
      uploadImage(file, `${Date.now()}-${file.name}`)
    )
    return Promise.all(uploads)
  }

  async function deleteImage(url: string){
    if(!url) return
    await supabase.storage.from('images').remove([url])
  }

  return { getImageUrl, uploadImage, uploadImages, deleteImage }
}
