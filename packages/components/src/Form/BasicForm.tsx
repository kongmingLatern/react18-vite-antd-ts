import type { ButtonProps, ColProps } from 'antd'
import type { FormInstance, FormProps } from 'antd/es/form'
import type { ReactNode } from 'react'
import type { EnhanceFormItemConfig } from './types'
import { Icon } from '@iconify/react'
import { http } from '@react18-vite-antd-ts/axios'
import { useAsync } from '@react18-vite-antd-ts/hooks'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'

// 定义表单项类型

// 定义BasicForm组件的props接口
export interface BasicFormProps {

  /**
   * 请求地址
   */
  url: string

  /** 表单初始值 */
  initialValues?: Record<string, any>
  /** 表单项配置数组 */
  formItems: EnhanceFormItemConfig[]
  /** 最大显示表单项数 */
  maxLength?: number
  /** antd Form实例 */
  form?: FormInstance

  /**
   * 表单请求方式
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
  /**
   * 提交文本
   */
  submitText?: string

  /**
   * 重置文本
   */
  resetText?: string

  /**
   * 操作区域配置
   * - true: 显示默认操作区域
   * - false: 不显示操作区域
   * - ReactNode: 自定义操作区域内容
   * - (form: FormInstance, reset: () => void) => ReactNode: 自定义操作区域渲染函数
   */
  footer?: boolean | ReactNode | ((form: FormInstance, reset: () => void) => ReactNode)

  /** 栅格列配置, 默认为 span: 6 */
  colProps?: ColProps
  /** antd Form组件props */
  formProps?: FormProps

  /**
   * 是否在提交前对表单数据进行处理
   */
  onBeforeSubmit?: (values: Record<string, any>) => Record<string, any>

  /** 提交按钮props */
  submitBtnProps?: ButtonProps
  /** 重置按钮props */
  resetBtnProps?: ButtonProps

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
  maxLength = 8,
  onFinish,
  onReset,
  onFinishFailed,
  initialValues,
  form,
  footer = true,
  submitText = '提交',
  resetText = '重置',
  submitBtnProps,
  resetBtnProps,
  formProps,
  colProps,
  method = 'post',
  url,
  onBeforeSubmit,
}, ref) => {
  const [formInstance] = Form.useForm(form)
  const [expanded, setExpanded] = useState(false)
  const { execute, loading } = useAsync(handleFinish)

  const colSpan = colProps?.span || 24
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
        return <InputNumber className="w-full" placeholder={item.placeholder} />
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
  async function handleFinish(values: Record<string, any>) {
    // Set loading to true immediately to handle async operations
    if (onBeforeSubmit) {
      values = onBeforeSubmit(values)
    }

    if (onFinish) {
      return await onFinish(values)
    }
    const res = await http[method](url, values)
    return res
  }

  // 渲染操作区域
  const renderFooter = () => {
    if (footer === false || footer === null)
      return null

    if (footer === true) {
      return (
        <Form.Item style={{ textAlign: 'center' }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} icon={<Icon style={{ display: 'flex' }} fontSize={18} icon="material-symbols:search" />} {...submitBtnProps}>
              {submitText}
            </Button>
            <Button onClick={reset} icon={<Icon style={{ display: 'flex' }} fontSize={18} icon="mdi:refresh" />} {...resetBtnProps}>{resetText}</Button>
          </Space>
        </Form.Item>
      )
    }

    if (typeof footer === 'function') {
      return footer(formInstance, reset)
    }

    return footer
  }

  const visibleItems = expanded ? formItems : formItems.slice(0, maxLength)

  return (
    <Form
      ref={ref}
      form={formInstance}
      onFinish={execute}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
      scrollToFirstError
      labelWrap
      {...layout}
      {...formProps}
    >
      {renderFooter()
        ? (
            <Row gutter={24}>
              <Col span={20}>
                <Row gutter={24}>
                  {visibleItems.map((item, index) => (
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
                  {formItems.length > maxLength && (
                    <Col span={24}>
                      <Button
                        type="text"
                        variant="link"
                        color="primary"
                        block
                        onClick={() => setExpanded(!expanded)}
                      >
                        <Space size={0}>
                          {expanded ? '缩起' : '更多'}
                          {expanded ? <Icon fontSize={16} style={{ display: 'flex' }} icon="mdi:chevron-up" /> : <Icon fontSize={16} style={{ display: 'flex' }} icon="mdi:chevron-down" />}
                        </Space>
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col span={4}>{renderFooter()}</Col>
            </Row>
          )
        : (
            <Row gutter={24}>
              {visibleItems.map((item, index) => (
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
              {formItems.length > maxLength && (
                <Col span={24}>
                  <Button
                    type="text"
                    variant="link"
                    color="primary"
                    block
                    onClick={() => setExpanded(!expanded)}
                  >
                    <Space size={0}>
                      {expanded ? '缩起' : '更多'}
                      {expanded ? <Icon fontSize={16} style={{ display: 'flex' }} icon="mdi:chevron-up" /> : <Icon fontSize={16} style={{ display: 'flex' }} icon="mdi:chevron-down" />}
                    </Space>
                  </Button>
                </Col>
              )}
            </Row>
          )}
    </Form>
  )
})
