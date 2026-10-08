const timeFormatter = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' })
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export function formatTime(date: Date): string {
  return timeFormatter.format(date)
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}
