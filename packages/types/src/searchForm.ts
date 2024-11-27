import type { FormItemProps } from 'antd'
import type { Rule } from 'antd/es/form'
import type { ColProps, FormInstance } from 'antd/lib'

export type FormItemType =
  | 'input'
  | 'number'
  | 'select'
  | 'datePicker'
  | 'time'
  | 'range'
  | 'switch'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'upload'
  | 'editor'
  | 'custom'

export interface EnhanceFormItemConfig extends FormItemProps {
  // 表单项类型
  type?: FormItemType

  /**
   * 表单项名称
   */
  name: string

  /**
   * label 标签
   */
  label?: string

  /**
   * rules 表单项规则
   */
  rules?: Rule[]

  /**
   * placeholder 占位符
   */
  placeholder?: string

  /**
   * 表单项选项(select, checkbox, radio)
   */
  options?: {
    label: string
    value: string
  }[]

  /**
   * 表单项列配置
   */
  colProps?: ColProps

  // 表单项注入项（用于扩展或覆盖）
  formOptions?: FormItemProps
}

export interface BasicFormProps {
  // 表单提交的url
  url: string

  // 表单提交的方法
  method?: 'post' | 'put' | 'patch' | 'delete' | 'get'

  // 表单项配置
  formItems: EnhanceFormItemConfig[]

  // 表单提交前参数处理
  beforeSubmit?: (formValue: Record<string, any>) => Record<string, any>

  // 自定义表单提交函数
  onSubmit?: (url: string, formValue: Record<string, any>) => void
}

export interface SearchFormProps extends Omit<BasicFormProps, 'onFinish'> {
  /**
   * 搜索回调
   */
  onSearch?: (values: any) => Promise<any>

  /**
   * 搜索完成后回调
   */
  onAfterSearch?: (res: Record<string, any>) => Promise<any>

  /**
   * 重置回调
   */
  onReset?: (formInstance: FormInstance | null) => void
}
