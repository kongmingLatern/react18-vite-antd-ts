import type { ColumnProps } from 'antd/es/table'
import type { BaseActionConfig, DefaultActionConfig } from './action'

export enum COLUMNTYPE {
  TIME = 'time',
  CUSTOM = 'custom',
  CURRENCY = 'CURRENCY',
  ACTION = 'ACTION',
  INDEX = 'INDEX',
}

export interface ColumnPropsWithFormat extends ColumnProps<any> {
  type?: COLUMNTYPE
  formatTime?: string
  formatCurrency?: 'USD' | 'CNY'
}

export interface ColumnPropsWithCustomRender extends ColumnProps<any> {
  actions?: BaseActionConfig[]

  // 最大可见操作按钮数（不包含“更多”），默认为3
  // 若设置为2，则会有3个按扭（其中一个为'更多'）
  maxVisible?: number | ((record: any, index: number) => number)

  customActions?: {
    text: string
    onClick: (record: any) => void
  }[]

  // 自定义渲染，脱离render函数
  customRender?: (text: any, record: any, index: number) => React.ReactNode

  // 查看操作的回调函数
  onView?: (record: any) => void
  // 编辑操作的回调函数
  onEdit?: (record: any) => void
  // 删除操作的回调函数
  onDelete?: (record: any) => void

  defaultActionCfg?: Partial<{
    hiddenBtn?: ('view' | 'edit' | 'delete')[]
    viewCfg: DefaultActionConfig
    editCfg: DefaultActionConfig
    deleteCfg: DefaultActionConfig
  }>
}

export type EnhanceColumnProps = ColumnPropsWithFormat & ColumnPropsWithCustomRender
