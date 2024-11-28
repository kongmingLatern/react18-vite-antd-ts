import type { PaginationType } from 'antd/es/transfer/interface'
import type { CommonTableProps } from '../CommonTable'
import type { ColumnPropsWithFormat, EnhanceColumnProps } from '../types'
import { getNestedValue } from '@react18-vite-antd-ts/utils'
import { ActionButton } from './ActionButton'
import { COLUMNTYPE } from './const'
import { renderCurrencyColumn, renderNestedColumn, renderTimeColumns } from './render'

function isNestedKey(key: string) {
  return key && key?.split('.')?.length > 1
}

// 如果设置type为time，就自动格式化时间
function isTimeColumn(column: ColumnPropsWithFormat) {
  return column.type === COLUMNTYPE.TIME
}

// 这里封装一些通用展示的列
export function createColumns(props: {
  columns: ColumnPropsWithFormat[]
}) {
  return props.columns?.map((column) => {
    const processedColumn = { ...column, dataIndex: column.key }

    if (isNestedKey(column.key as string)) {
      processedColumn.render = column.render || ((_, record, index) => {
        const targetValue = getNestedValue(record, column.key)
        return renderNestedColumn(targetValue, { column, record, index })
      })
    }

    if (isTimeColumn(column)) {
      processedColumn.render = (text: string) => renderTimeColumns(text, column.formatTime)
    }

    return processedColumn
  })
}

type ColumnProcessor = (column: EnhanceColumnProps, pagination: { page: number, pageSize: number }) => Partial<EnhanceColumnProps>

const columnProcessors: Record<string, ColumnProcessor> = {
  [COLUMNTYPE.INDEX]: (column, pagination) => ({
    title: '序号',
    key: COLUMNTYPE.INDEX,
    render: (_, __, index) => pagination ? index + 1 + (pagination.page - 1) * pagination.pageSize : index + 1,
    ...column,
  }),
  [COLUMNTYPE.TIME]: column => ({
    render: (text: string) => renderTimeColumns(text, column.formatTime),
    ...column,
  }),
  [COLUMNTYPE.CURRENCY]: column => ({
    render: (text: number) => renderCurrencyColumn(text, column.formatCurrency),
    ...column,
  }),
  [COLUMNTYPE.ACTION]: column => ({
    title: '操作',
    align: 'center',
    render: (_, record, index) => {
      return (
        <ActionButton
          key={index}
          {...column}
          index={index}
          record={record}
        />
      )
    },
    ...column,
  }),
}

export function createExtensibleColumns(props: {
  pagination?: { page: number, pageSize: number }
  columns: EnhanceColumnProps[]
  dataCfg?: CommonTableProps['dataCfg']
  customProcessors?: Record<string, ColumnProcessor>
  customRender?: (column: EnhanceColumnProps) => Partial<EnhanceColumnProps>
}) {
  const { pagination, columns, customProcessors = {}, dataCfg, customRender } = props
  const { showAction = true } = dataCfg || {}
  const allProcessors = { ...columnProcessors, ...customProcessors }

  // 判断是否需要显示操作列
  function needShowActionColumn(column: EnhanceColumnProps) {
    return showAction && ((column?.actions?.length || 0) > 0 || (column?.customActions?.length || 0) > 0)
  }

  return columns?.map((column) => {
    let processedColumn = { ...column, dataIndex: column.key }

    // 如果设置了customRender，则使用customRender
    if (customRender) {
      processedColumn = { ...processedColumn, ...customRender(column) }
    }

    // 非操作列，且是嵌套列，且没有render，则使用默认的render
    if (!needShowActionColumn(column) && isNestedKey(column?.key as string) && !column.render) {
      processedColumn.render = (_, record, index) => {
        const targetValue = getNestedValue(record, column.key)
        return renderNestedColumn(targetValue, { column, record, index })
      }
    }

    // 如果设置了type，则使用对应的processor
    if (column.type && allProcessors[column.type]) {
      console.log('pagination', pagination)

      processedColumn = { ...processedColumn, ...allProcessors[column.type](column, pagination) }
    }

    return processedColumn
  })
}
