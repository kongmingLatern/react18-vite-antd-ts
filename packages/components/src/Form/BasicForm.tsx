import type { ColProps } from 'antd'
import type { FormInstance, FormProps } from 'antd/es/form'
import type { ReactNode } from 'react'
import type { EnhanceFormItemConfig } from './types'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'

// 定义表单项类型

// 定义BasicForm组件的props接口
export interface BasicFormProps {
  /** 表单初始值 */
  initialValues?: Record<string, any>
  /** 表单项配置数组 */
  formItems: EnhanceFormItemConfig[]
  /** antd Form实例 */
  form?: FormInstance

  /**
   * 操作区域配置
   * - true: 显示默认操作区域
   * - false: 不显示操作区域
   * - ReactNode: 自定义操作区域内容
   * - (form: FormInstance, reset: () => void) => ReactNode: 自定义操作区域渲染函数
   */
  footer?: boolean | ReactNode | ((form: FormInstance, reset: () => void) => ReactNode)

  /** 是否启用栅格布局 */
  grid?: boolean
  /** 栅格列配置, 默认为 span: 6 */
  colProps?: ColProps
  /** antd Form组件props */
  formProps?: FormProps

  /** 表单提交成功回调 */
  onFinish?: (values: any) => any
  /** 表单提交失败回调 */
  onFinishFailed?: (errorInfo: any) => any
  /** 重置表单回调 */
  onReset?: (formInstance: FormInstance) => void
}

// BasicForm组件
export const BasicForm = forwardRef<FormInstance, BasicFormProps>(({
  formItems,
  onFinish,
  onReset,
  onFinishFailed,
  initialValues,
  form,
  footer = true,
  formProps,
  colProps,
}, ref) => {
  const [formInstance] = Form.useForm(form)
  const colSpan = colProps?.span || 6
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }

  useImperativeHandle(ref, () => formInstance)

  // 渲染表单项
  const renderFormItem = (item: EnhanceFormItemConfig) => {
    switch (item.type) {
      case 'input':
        return <Input placeholder={item.placeholder} />
      case 'number':
        return <InputNumber placeholder={item.placeholder} />
      case 'select':
        return (
          <Select placeholder={item.placeholder}>
            {item.options?.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        )
      case 'datePicker':
        return <DatePicker style={{ width: '100%' }} />
      default:
        return null
    }
  }

  function reset() {
    if (onReset) {
      onReset && onReset(formInstance)
      return
    }
    formInstance.resetFields()
  }

  // 渲染操作区域
  const renderFooter = () => {
    if (footer === false || footer === null)
      return null

    if (footer === true) {
      return (
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button onClick={reset}>重置</Button>
          </Space>
        </Form.Item>
      )
    }

    if (typeof footer === 'function') {
      return footer(formInstance, reset)
    }

    return footer
  }

  return (
    <Form
      ref={ref}
      form={formInstance}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
      scrollToFirstError
      labelWrap
      {...layout}
      {...formProps}
    >
      <Row gutter={24}>
        {formItems.map((item, index) => (
          <Col key={index} span={colSpan} {...(item.colProps || colProps)}>
            <Form.Item
              name={item.name.split('.')}
              label={<span className="font-semibold">{item.label}</span>}
              rules={item.rules}
              {...item.formOptions}
            >
              {renderFormItem(item)}
            </Form.Item>
          </Col>
        ))}
      </Row>

      {renderFooter()}
    </Form>
  )
})
