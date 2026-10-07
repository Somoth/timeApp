// `undefined` locale = the visitor's browser locale, so each user sees their
// own conventions (e.g. "8:04:05 PM" / "Oct 6, 2026" in the US) in their own timezone.

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { timeStyle: 'medium' })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { dateStyle: 'medium' })
}
