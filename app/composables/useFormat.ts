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
  return {age, timeInShelter}
}
