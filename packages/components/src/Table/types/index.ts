import { ColumnProps } from "antd/es/table"

export enum COLUMNTYPE {
  TIME = 'time',
  CUSTOM = 'custom',
  CURRENCY = "CURRENCY",
  ACTION = "ACTION",
}

export interface ColumnPropsWithFormat extends ColumnProps<any> {
  type?: COLUMNTYPE
  formatTime?: string
  formatCurrency?: 'USD' | 'CNY'
}

export interface ColumnPropsWithCustomRender extends ColumnProps<any> {
  actions?: ('view' | 'edit' | 'delete')[];

  customActions?: {
    text: string
    onClick: (record: any) => void
  }[]

  // 自定义渲染，脱离render函数
  customRender?: (text: any, record: any, index: number) => React.ReactNode;

  // 查看操作的回调函数
  onView?: (record: any) => void
  // 编辑操作的回调函数
  onEdit?: (record: any) => void
  // 删除操作的回调函数
  onDelete?: (record: any) => void
}

export type EnhanceColumnProps = ColumnPropsWithFormat & ColumnPropsWithCustomRender