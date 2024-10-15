import { ColumnProps } from "antd/es/table"

export enum COLUMNTYPE {
  TIME = 'time',
  CUSTOM = 'custom',
  CURRENCY = "CURRENCY",
}

export interface ColumnPropsWithFormatTime extends ColumnProps<any> {
  type?: COLUMNTYPE
  formatTime?: string
}

export interface ColumnPropsWithCustomRender extends ColumnProps<any> {
  // 自定义渲染，脱离render函数
  customRender?: (text: any, record: any, index: number) => React.ReactNode
}
