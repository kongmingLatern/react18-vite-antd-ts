import { describe, it, expect, vi } from 'vitest'
import { createColumns, renderTimeColumns, ColumnType } from '../helpers/columns'
import { formatDate } from '@react18-vite-antd-ts/utils'

// Mock the formatDate function
vi.mock('@react18-vite-antd-ts/utils', () => ({
  formatDate: vi.fn((date, format) => `Formatted: ${date}, ${format}`)
}))

describe('columns helpers', () => {
  describe('createColumns', () => {
    it('should create columns with correct properties', () => {
      const columns = [
        { key: 'name', title: 'Name' },
        { key: 'age', title: 'Age' },
        { key: 'birthDate', title: 'Birth Date', type: ColumnType.TIME }
      ]

      const result = createColumns({ columns })

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual(expect.objectContaining({ key: 'name', title: 'Name', dataIndex: 'name' }))
      expect(result[1]).toEqual(expect.objectContaining({ key: 'age', title: 'Age', dataIndex: 'age' }))
      expect(result[2]).toEqual(expect.objectContaining({
        key: 'birthDate',
        title: 'Birth Date',
        type: ColumnType.TIME,
        dataIndex: 'birthDate',
      }))
      expect(result[2].render).toBeDefined()
    })
  })

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
})

