import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createColumns, renderTimeColumns, ColumnType, ColumnPropsWithFormatTime } from '../helpers/columns'
import { formatDate, getNestedValue } from '@react18-vite-antd-ts/utils'

vi.mock('@react18-vite-antd-ts/utils', () => ({
  formatDate: vi.fn((date, format) => `Formatted: ${date}, ${format}`),
  getNestedValue: vi.fn((obj, path) => obj[path])
}))

// Mock the formatDate function
// vi.mock('@react18-vite-antd-ts/utils', () => ({
//   formatDate: vi.fn((date, format) => `Formatted: ${date}, ${format}`)
// }))

describe('columns helpers', () => {
  describe('createColumns', () => {
    let columns: ColumnPropsWithFormatTime[]
    let data: any[]

    beforeEach(() => {
      columns = [
        { key: 'name', title: 'Name' },
        { key: 'age', title: 'Age' },
        { key: 'birthDate', title: 'Birth Date', type: ColumnType.TIME }
      ]
      data = [
        { name: '123', age: 12, birthDate: '2023-04-01' },
        { name: '133', age: 13, birthDate: '2023-04-02' },
        { name: '143', age: 14, birthDate: '2023-04-03' },
      ]
    })

    it('should create columns with correct properties', () => {
      const result = createColumns({ columns, data })

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

    it('should auto format by nested key', () => {
      columns = [
        { key: 'user.name', title: 'User Name' },
        { key: 'user.time', title: 'User Time', type: ColumnType.TIME },
        { key: 'user.age', title: 'User Age', render: (value) => value + 1 }
      ]
      data = [
        { user: { time: '123', name: '123', age: 12 } },
        { user: { time: '133', name: '133', age: 13 } },
        { user: { time: '143', name: '143', age: 14 } },
      ]
      const result = createColumns({ columns, data })
      expect(result[0]).toEqual(expect.objectContaining({ key: 'user.name', title: 'User Name', dataIndex: 'user.name', render: expect.any(Function) }))
      expect(result[1]).toEqual(expect.objectContaining({ key: 'user.time', title: 'User Time', dataIndex: 'user.time', render: expect.any(Function) }))
      expect(result[2]).toEqual(expect.objectContaining({ key: 'user.age', title: 'User Age', dataIndex: 'user.age', render: expect.any(Function) }))
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

