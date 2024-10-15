import { formatDate } from "@react18-vite-antd-ts/utils"
import { ColumnPropsWithCustomRender, EnhanceColumnProps} from "../types"
import { Button } from "antd"

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

export const renderCurrencyColumn = (value: number, format: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: format }).format(value);
}

