import { describe, expect, it } from 'vitest'
import {
  addDays,
  formatDate,
  getEndOfDay,
  getRelativeTime,
  getStartOfDay,
  isSameDay,
  subtractDays,
} from '../dayjs'

describe('dayjs utils', () => {
  it('formatDate should format date correctly', () => {
    const date = '2023-04-15 12:00:00'
    expect(formatDate(date)).toBe('2023-04-15')
    expect(formatDate(date, 'YYYY/MM/DD')).toBe('2023/04/15')
  })

  it('getRelativeTime should return relative time string', () => {
    const now = Date.now()
    const pastDate = now - 24 * 60 * 60 * 1000 // 1 day ago
    expect(getRelativeTime(pastDate)).toBe('a day ago')
  })

  it('addDays should add days correctly', () => {
    const date = '2023-04-15 12:00:00'
    const result = addDays(date, 5)
    expect(formatDate(result)).toBe('2023-04-20')
  })

  it('subtractDays should subtract days correctly', () => {
    const date = '2023-04-15 12:00:00'
    const result = subtractDays(date, 5)
    expect(formatDate(result)).toBe('2023-04-10')
  })

  it('isSameDay should compare days correctly', () => {
    const date1 = '2023-04-15 12:00:00'
    const date2 = '2023-04-15 18:30:00'
    const date3 = '2023-04-16 12:00:00'
    expect(isSameDay(date1, date2)).toBe(true)
    expect(isSameDay(date1, date3)).toBe(false)
  })

  it('getStartOfDay should return the start of the day', () => {
    const date = '2023-04-15 12:34:56'
    const result = getStartOfDay(date)
    expect(formatDate(result, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-04-15 00:00:00')
  })

  it('getEndOfDay should return the end of the day', () => {
    const date = '2023-04-15 12:34:56'
    const result = getEndOfDay(date)
    expect(formatDate(result, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-04-15 23:59:59')
  })

  it('should handle timestamps correctly', () => {
    const timestamp = 1681545600000 // 2023-04-15 12:00:00 UTC

    expect(formatDate(timestamp)).toBe('2023-04-15')
    expect(formatDate(timestamp, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-04-15 16:00:00')

    const futureTimestamp = timestamp + 86400000 // Add 1 day
    expect(isSameDay(timestamp, futureTimestamp)).toBe(false)

    const pastTimestamp = timestamp - 3600000 // Subtract 1 hour
    expect(isSameDay(timestamp, pastTimestamp)).toBe(true)

    expect(getRelativeTime(timestamp)).toMatch(/ago/)

    const startOfDayTimestamp = getStartOfDay(timestamp).getTime()
    expect(formatDate(startOfDayTimestamp, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-04-15 00:00:00')

    const endOfDayTimestamp = getEndOfDay(timestamp).getTime()
    expect(formatDate(endOfDayTimestamp, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-04-15 23:59:59')
  })
})
