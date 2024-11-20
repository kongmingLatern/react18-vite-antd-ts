import type { ButtonProps } from 'antd'
import type { EnhanceColumnProps } from '.'

// 定义基础操作配置接口
export interface BaseActionConfig {
  key?: string
  text?: string | ((record: any, index: number) => string)
  buttonProps?: ButtonProps
  onClick?: (record: any) => void
  danger?: boolean
  needConfirm?: boolean
  confirmTitle?: string
  index?: number
  render?: (action: BaseActionConfig, record: any) => React.ReactNode
  hidden?: ((record: any) => boolean) | boolean
  onBeforeSubmit?: (record: any) => any
}

// 定义默认操作类型
export type DefaultActionType = 'view' | 'edit' | 'delete'

// 定义默认操作配置接口
export interface DefaultActionConfig extends BaseActionConfig {
  key?: DefaultActionType
  // formCfg: {}
}

export interface ActionButtonDefaultConfig {
  hiddenBtn?: DefaultActionType[]
  viewCfg: DefaultActionConfig
  editCfg: DefaultActionConfig
  deleteCfg: DefaultActionConfig
}

// 定义操作按钮属性接口
export interface ActionButtonProps extends EnhanceColumnProps {
  record: any
  index: number
  renderButton?: (
    action: BaseActionConfig,
    record: Record<string, any>,
    index: number
  ) => React.ReactNode
  renderTextLink?: (
    action: BaseActionConfig,
    record: Record<string, any>,
    index: number,
  ) => React.ReactNode
}
