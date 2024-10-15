import { ColumnProps } from "antd/es/table"
import { formatDate } from '@react18-vite-antd-ts/utils'

export enum ColumnType {
  TIME = 'time',
}

export interface ColumnPropsWithFormatTime extends ColumnProps<any> {
  type?: ColumnType
  formatTime?: string
}

// 这里封装一些通用展示的列
export function createColumns(props: {
  columns: ColumnPropsWithFormatTime[]
}) {

  // 如果设置type为time，就自动格式化时间
  function isTimeColumn(column: ColumnPropsWithFormatTime) {
    return column.type === ColumnType.TIME
  }

  return props.columns?.map(column => {

    // 如果列是时间列，则使用 formatTime 格式化时间 (根据 key)
    if (isTimeColumn(column)) {
      return {
        ...column,
        dataIndex: column.key,
        render: (value: string | number) => renderTimeColumns(value, column.formatTime),
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
