import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export function formatDate(date: string | number | Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function getRelativeTime(date: string | number | Date): string {
  return dayjs(date).fromNow()
}

export function addDays(date: string | number | Date, days: number): Date {
  return dayjs(date).add(days, 'day').toDate()
}

export function subtractDays(date: string | number | Date, days: number): Date {
  return dayjs(date).subtract(days, 'day').toDate()
}

export function isSameDay(date1: string | number | Date, date2: string | number | Date): boolean {
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

export function getStartOfDay(date: string | number | Date): Date {
  return dayjs(date).startOf('day').toDate()
}

export function getEndOfDay(date: string | number | Date): Date {
  return dayjs(date).endOf('day').toDate()
}

export { dayjs }
