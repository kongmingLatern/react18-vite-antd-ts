import { renderNestedColumn, renderTimeColumns } from "./render"
import { ColumnPropsWithFormatTime, COLUMNTYPE } from "../types"
import { getNestedValue } from "@react18-vite-antd-ts/utils"

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
}) {

  return props.columns?.map((column) => {
    let key = column.key
    if (isNestedKey(key as string)) {
      if (column.render) {
        // 如果设置了render，则不进行嵌套渲染
        return {
          ...column,
          dataIndex: key,
        }
      }
      column.render = (_, record, index) => {
        const targetValue = getNestedValue(record, key)
        return renderNestedColumn(targetValue, {
          column,
          record,
          index
        }) 
      } 
    }
    // 如果列是时间列，则使用 formatTime 格式化时间 (根据 key)
    if (isTimeColumn(column)) {
      return {
        ...column,
        dataIndex: key,
        render: (text: string) => renderTimeColumns(text, column.formatTime),
      }
    }
    return {
      ...column,
      // 自动设置
      dataIndex: column.key,
    }
  })
}
