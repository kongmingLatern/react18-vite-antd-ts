import { ColumnProps } from "antd/es/table"
import { formatDate, getNestedValue } from '@react18-vite-antd-ts/utils'

export enum ColumnType {
  TIME = 'time',
}

export interface ColumnPropsWithFormatTime extends ColumnProps<any> {
  type?: ColumnType
  formatTime?: string
}

function isNestedKey(key: string) {
  return key.split('.')?.length > 1
}

// 如果设置type为time，就自动格式化时间
function isTimeColumn(column: ColumnPropsWithFormatTime) {
  return column.type === ColumnType.TIME
}

// 这里封装一些通用展示的列
export function createColumns(props: {
  columns: ColumnPropsWithFormatTime[]
  data: any[]
}) {

  return props.columns?.map((column, index) => {

    let key = column.key
    let dataValue = props.data[index]?.[key]

    if (isNestedKey(key as string)) {
      dataValue = getNestedValue(props.data, key)
      column.render = typeof column.render === 'function' ? column.render : () => dataValue
    }

    // 如果列是时间列，则使用 formatTime 格式化时间 (根据 key)
    if (isTimeColumn(column)) {
      return {
        ...column,
        dataIndex: key,
        render: () => renderTimeColumns(dataValue, column.formatTime),
      }
    }

    return {
      ...column,
      // 自动设置
      dataIndex: column.key,
    }
  })
}

export const renderTimeColumns = (time: string | number, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return formatDate(time, format)
}
