import { formatDate } from "@react18-vite-antd-ts/utils"
import { ColumnPropsWithCustomRender} from "../types"

export const renderTimeColumns = (time: string | number, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return formatDate(time, format)
}

export const renderNestedColumn = (targetValue: any, {
  column,
  record,
  index
}: {
  column: ColumnPropsWithCustomRender
  record: any
  index: number
}) => {
  return column.customRender ? column.customRender(targetValue, record, index) : targetValue
}
