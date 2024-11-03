import type { FormInstance, FormProps } from 'antd/es/form'
import type { ReactNode } from 'react'
import type { EnhanceFormItemConfig } from './types'
import { Button, DatePicker, Form, Input, Select, Space } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'

// 定义表单项类型

// 定义BasicForm组件的props接口
export interface BasicFormProps {
  formItems: EnhanceFormItemConfig[]
  onFinish?: (values: any) => Promise<void>
  onFinishFailed?: (errorInfo: any) => Promise<void>
  onReset?: (formInstance: FormInstance) => void
  initialValues?: Record<string, any>
  form?: FormInstance
  footer?: ReactNode | boolean
  formProps?: FormProps
}

// BasicForm组件
export const BasicForm = forwardRef<FormInstance, BasicFormProps>(({
  formItems,
  onFinish,
  onReset,
  onFinishFailed,
  initialValues,
  form,
  footer,
  formProps,
}, ref) => {
  const [formInstance] = Form.useForm(form)
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
      {formItems.map(item => (
        <Form.Item
          key={item.name}
          name={item.name.split('.')}
          label={<span className="font-semibold">{item.label}</span>}
          rules={item.rules}
          {...item.formOptions}
        >
          {renderFormItem(item)}
        </Form.Item>
      ))}

      {footer
        ? (
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button onClick={reset}>重置</Button>
              </Space>
            </Form.Item>
          )
        : null}
    </Form>
  )
})
