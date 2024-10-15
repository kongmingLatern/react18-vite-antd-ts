import { ColumnProps } from "antd/es/table"

const timeColumns = ['createTime', 'updateTime']

// 这里封装一些通用展示的列
export function createColumns<T>(props: {
  columns: ColumnProps<T>[]
}) {
  return props.columns?.map(column => {

    if(timeColumns.includes(column.dataIndex as string)) {
      return {
        ...column,
        render: renderTimeColumns,
      }
    }

  })
}

export const renderTimeColumns = (time: string | number) => {
  if(typeof time === 'string') {
    return time
  }

  return 
}