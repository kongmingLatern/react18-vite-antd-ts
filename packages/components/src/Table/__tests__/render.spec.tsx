import { formatDate } from '@react18-vite-antd-ts/utils'
import { describe, expect, it, vi } from 'vitest'
import { renderCurrencyColumn, renderNestedColumn, renderTimeColumns } from '../helpers/render'

// Mock the formatDate function
vi.mock('@react18-vite-antd-ts/utils', () => ({
  formatDate: vi.fn((date, format) => `Formatted: ${date}, ${format}`),
}))

describe('render helpers', () => {
  describe('renderTimeColumns', () => {
    it('should format time with default format', () => {
      const time = '2023-04-01'
      const result = renderTimeColumns(time)
      expect(formatDate).toHaveBeenCalledWith(time, 'YYYY-MM-DD HH:mm:ss')
      expect(result).toBe('Formatted: 2023-04-01, YYYY-MM-DD HH:mm:ss')
    })

    it('should format time with custom format', () => {
      const time = '2023-04-01'
      const format = 'DD/MM/YYYY'
      const result = renderTimeColumns(time, format)
      expect(formatDate).toHaveBeenCalledWith(time, format)
      expect(result).toBe('Formatted: 2023-04-01, DD/MM/YYYY')
    })
  })

  describe('renderCurrencyColumn', () => {
    it('should format currency with default USD format', () => {
      const value = 1234.56
      const result = renderCurrencyColumn(value)
      expect(result).toBe('$1,234.56')
    })

    it('should format currency with custom format', () => {
      const value = 1234.56
      const result = renderCurrencyColumn(value, 'EUR')
      expect(result).toBe('€1,234.56')
    })

    it('should handle negative values', () => {
      const value = -1234.56
      const result = renderCurrencyColumn(value)
      expect(result).toBe('-$1,234.56')
    })

    it('should handle zero value', () => {
      const value = 0
      const result = renderCurrencyColumn(value)
      expect(result).toBe('$0.00')
    })
  })

  describe('renderNestedColumn', () => {
    it('should render nested value', () => {
      const value = 'Test Value'
      const context = {
        column: { key: 'test', title: 'Test' },
        record: { test: 'Test Value' },
        index: 0,
      }
      const result = renderNestedColumn(value, context)
      expect(result).toBe('Test Value')
    })

    it('should handle undefined value', () => {
      const value = undefined
      const context = {
        column: { key: 'test', title: 'Test' },
        record: {},
        index: 0,
      }
      const result = renderNestedColumn(value, context)
      expect(result).toBe(undefined)
    })

    it('should handle null value', () => {
      const value = null
      const context = {
        column: { key: 'test', title: 'Test' },
        record: { test: null },
        index: 0,
      }
      const result = renderNestedColumn(value, context)
      expect(result).toBe(null)
    })
  })
})
