import type { ColumnPropsWithFormat } from '../types'

import { formatDate, getNestedValue } from '@react18-vite-antd-ts/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createColumns, createExtensibleColumns } from '../helpers/columns'

import { COLUMNTYPE } from '../helpers/const'
import { renderTimeColumns } from '../helpers/render'

vi.mock('@react18-vite-antd-ts/utils', () => ({
  formatDate: vi.fn((date, format) => `Formatted: ${date}, ${format}`),
  getNestedValue: vi.fn((obj, path) => obj[path]),
}))

describe('columns helpers', () => {
  describe('createColumns', () => {
    let columns: ColumnPropsWithFormat[]

    beforeEach(() => {
      columns = [
        { key: 'name', title: 'Name' },
        { key: 'age', title: 'Age' },
        { key: 'birthDate', title: 'Birth Date', type: COLUMNTYPE.TIME },
      ]
    })

    it('should create columns with correct properties', () => {
      const result = createColumns({ columns })

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual(expect.objectContaining({ key: 'name', title: 'Name', dataIndex: 'name' }))
      expect(result[1]).toEqual(expect.objectContaining({ key: 'age', title: 'Age', dataIndex: 'age' }))
      expect(result[2]).toEqual(expect.objectContaining({
        key: 'birthDate',
        title: 'Birth Date',
        type: COLUMNTYPE.TIME,
        dataIndex: 'birthDate',
      }))
      expect(result[2].render).toBeDefined()
    })

    it('should auto format by nested key', () => {
      columns = [
        { key: 'user.name', title: 'User Name' },
        { key: 'user.time', title: 'User Time', type: COLUMNTYPE.TIME },
        { key: 'user.age', title: 'User Age', render: value => value + 1 },
      ]

      const result = createColumns({ columns })
      expect(result[0]).toEqual(expect.objectContaining({ key: 'user.name', title: 'User Name', dataIndex: 'user.name', render: expect.any(Function) }))
      expect(result[1]).toEqual(expect.objectContaining({ key: 'user.time', title: 'User Time', dataIndex: 'user.time', render: expect.any(Function) }))
      expect(result[2]).toEqual(expect.objectContaining({ key: 'user.age', title: 'User Age', dataIndex: 'user.age', render: expect.any(Function) }))
    })
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

describe('createExtensibleColumns', () => {
  let columns: ColumnPropsWithFormat[]

  beforeEach(() => {
    columns = [
      { key: 'name', title: 'Name' },
      { key: 'age', title: 'Age' },
      { key: 'birthDate', title: 'Birth Date', type: COLUMNTYPE.TIME },
      { key: 'user.address', title: 'Address' },
    ]
  })

  it('should create columns with correct properties', () => {
    const result = createExtensibleColumns({ columns })

    expect(result).toHaveLength(4)
    expect(result[0]).toEqual(expect.objectContaining({ key: 'name', title: 'Name', dataIndex: 'name' }))
    expect(result[1]).toEqual(expect.objectContaining({ key: 'age', title: 'Age', dataIndex: 'age' }))
    expect(result[2]).toEqual(expect.objectContaining({
      key: 'birthDate',
      title: 'Birth Date',
      type: COLUMNTYPE.TIME,
      dataIndex: 'birthDate',
      render: expect.any(Function),
    }))
    expect(result[3]).toEqual(expect.objectContaining({
      key: 'user.address',
      title: 'Address',
      dataIndex: 'user.address',
      render: expect.any(Function),
    }))
  })

  it('should apply custom processors', () => {
    const customProcessors = {
      [COLUMNTYPE.CUSTOM]: (_: ColumnPropsWithFormat) => ({
        render: () => 'Custom Rendered',
      }),
    }

    columns.push({ key: 'custom', title: 'Custom', type: COLUMNTYPE.CUSTOM as any })

    const result = createExtensibleColumns({ columns, customProcessors })

    expect(result).toHaveLength(5)
    expect(result[4]).toEqual(expect.objectContaining({
      key: 'custom',
      title: 'Custom',
      type: COLUMNTYPE.CUSTOM,
      dataIndex: 'custom',
      render: expect.any(Function),
    }))

    const customRendered = result[4].render!('any', {}, 0)
    expect(customRendered).toBe('Custom Rendered')
  })

  it('should handle nested keys correctly', () => {
    const record = { user: { address: '123 Main St' } }
    const result = createExtensibleColumns({ columns })

    result[3].render!('any', record, 0)
    expect(getNestedValue).toHaveBeenCalledWith(record, 'user.address')
  })

  it('should handle time columns correctly', () => {
    const result = createExtensibleColumns({ columns })
    const timeValue = '2023-05-01'
    result[2].render!(timeValue, {}, 0)

    expect(formatDate).toHaveBeenCalledWith(timeValue, 'YYYY-MM-DD HH:mm:ss')
  })
})
