import { Temporal } from 'temporal-polyfill'
export function useFormat() {
  function age(months: number, registeredAt: string){
    // add the months since they were registered to age_months value for dynamic change
    const start = Temporal.PlainDate.from(registeredAt)
    const now = Temporal.Now.plainDateISO()

    const diff = start.until(now, {smallestUnit: 'months'})

    if (diff.years > 0) months = months + (diff.years * 12)
    if (diff.months > 0)  months = months + diff.months

    // firstly - get the years by months
    const years = Math.floor(months / 12)
    //  and the rest of the months
    const remainingMonth = months % 12

    if (years === 0) return `${remainingMonth} mdr.`
    if (remainingMonth === 0) return `${years} år`

    return `${years} år ${remainingMonth} mdr.`
  }
  function timeInShelter(registeredAt: string) {
    const start = Temporal.PlainDate.from(registeredAt)
    const now = Temporal.Now.plainDateISO()

    const diff = start.until(now, {largestUnit: 'years'})

    if (diff.years > 0) return `Har ventet ${diff.years} år på et nyt hjem`
    if (diff.months === 1) return `Har ventet ${diff.months} måned på et nyt hjem`
    if (diff.months > 0) return `Har ventet ${diff.months} måneder på et nyt hjem`
    if (diff.days === 1) return `Har ventet ${diff.days} dag på et nyt hjem`
    if (diff.days === 0) return 'Første dag på internatet'

    return `Har ventet ${diff.days} dage på et nyt hjem`
  }

  function timeInShelterSimple(registeredAt: string) {
    const start = Temporal.PlainDate.from(registeredAt)
    const now = Temporal.Now.plainDateISO()

    const diff = start.until(now, {largestUnit: 'years'})

    if (diff.years > 0) return `${diff.years} år`
    if (diff.months === 1) return `${diff.months} måned`
    if (diff.months > 0) return `${diff.months} måneder`
    if (diff.days === 1) return `${diff.days} dag`
    if (diff.days === 0) return 'Første dag på internatet'

    return `${diff.days} dage`
  }

  function bookingDateTime(startsAt: string, duration: number) {
    // getting start and end time for booking based on our arguments (danish time)
    const start = Temporal.Instant.from(startsAt)
      .toZonedDateTimeISO('Europe/Copenhagen')
    const end = start.add({minutes: duration})

    // three formats - date (full format) - time (the time to-from) - dayShort (smaller format for bookinglist)
    return {
      date: start.toLocaleString('da-DK', {
        weekday: 'long',
        day: 'numeric',
        month:  'long',
        year:'numeric',
      }),
      time: `${start.toLocaleString('da-DK', {
        hour:'2-digit',
        minute: '2-digit',
      })}–${end.toLocaleString('da-DK', {
        hour:'2-digit',
        minute: '2-digit',
      })}`,
      dateShort: start.toLocaleString('da-DK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
    }
  }
  return {age, timeInShelter, bookingDateTime, timeInShelterSimple}
}

