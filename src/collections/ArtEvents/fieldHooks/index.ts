import { FieldHook } from 'payload'
import slugify from 'slugify'

const format = (val: string) => {
  return slugify(val, {
    lower: true,
    strict: true,
  })
}

export const formatSlug: FieldHook = async ({ value, data, operation }) => {
  if (!(operation == 'create' || operation == 'update')) return value

  if (!data?.title) return value

  const slugedTitle = format(data.title)

  const eventDate = new Date(data.time)
  const fDate = {
    yearNum: eventDate.getFullYear().toString(),
    monthNum: eventDate.toLocaleString('fr-FR', { month: 'numeric' }),
    dayNum: eventDate.getDate(),
  }

  const suffix = `_${fDate.dayNum}_${fDate.monthNum}_${fDate.yearNum}`

  const slugString = `${slugedTitle}${suffix}`
  return slugString
}
