export const useAnimalMetaData = () => {

  const status = {
    available: {label: 'ledig', class: 'bg-salvie-300 text-salvie-900'},
    reserved: {label: 'reserveret',  class: 'bg-sand text-bark-500'},
    adopted: {label: 'adopteret', class: 'bg-rust-300 text-rust-900'},
  } as const

  const species = {
    dog: 'hund',
    cat: 'kat',
    rabbit: 'kanin',
  } as const

  const gender = {
    male: 'han',
    female: 'hun',
  } as const

  const size = {
    small: 'Lille',
    medium: 'Mellem',
    large: 'Stor',
  } as const

  const personality = {
    calm: 'Rolig',
    playful:'Legesyg',
    affectionate:'Kærlig',
  } as const

  const appointmentType = {
    visit:'Standard',
    petting:'Kæletid',
    walk: 'Gåtur',
  } as const


  return { status, species, gender, size, personality, appointmentType}
}
