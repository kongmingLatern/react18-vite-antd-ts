import { ColumnProps } from "antd/es/table"

export enum COLUMNTYPE {
  TIME = 'time',
}

export interface ColumnPropsWithFormatTime extends ColumnProps<any> {
  type?: COLUMNTYPE
  formatTime?: string
}