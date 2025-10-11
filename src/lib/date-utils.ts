import { format, formatDistance, formatRelative } from 'date-fns'
import { th } from 'date-fns/locale'

/**
 * Format date in Thai locale
 */
export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, formatStr, { locale: th })
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'PPP p', { locale: th })
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistance(d, new Date(), { addSuffix: true, locale: th })
}

/**
 * Format date for job cards (e.g., "พรุ่งนี้", "ศุกร์ 10 ม.ค.")
 */
export function formatJobDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const relative = formatRelative(d, new Date(), { locale: th })
  
  // If it's today or tomorrow, use relative
  if (relative.includes('วันนี้') || relative.includes('พรุ่งนี้')) {
    return relative.split(' ')[0] // Just "วันนี้" or "พรุ่งนี้"
  }
  
  // Otherwise use date format
  return format(d, 'EEE d MMM', { locale: th })
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d < new Date()
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

