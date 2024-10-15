import { getNestedValue } from "@react18-vite-antd-ts/utils"
import { renderTimeColumns } from "./render"
import { ColumnPropsWithFormatTime, COLUMNTYPE } from "../types"

function isNestedKey(key: string) {
  return key.split('.')?.length > 1
}

// 如果设置type为time，就自动格式化时间
function isTimeColumn(column: ColumnPropsWithFormatTime) {
  return column.type === COLUMNTYPE.TIME
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
