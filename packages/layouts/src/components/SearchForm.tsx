import type { SearchFormProps } from '@react18-vite-antd-ts/types'
import { BasicForm } from '@react18-vite-antd-ts/components'
import { Collapse, type FormInstance, theme } from 'antd'
import classNames from 'classnames'
import { forwardRef, useImperativeHandle, useRef } from 'react'

export interface SearchFormRef {
  formInstance: FormInstance
  getFormData: () => Record<string, any>
}

export const SearchForm = forwardRef((props: SearchFormProps, ref) => {
  const { onSearch, onAfterSearch, onReset } = props
  const { token } = theme.useToken()
  const formInstance = useRef<FormInstance>(null)

  useImperativeHandle(ref, () => ({
    formInstance: formInstance.current,
    getFormData: () => formInstance.current?.getFieldsValue(),
  }))

  async function handleSearch(values: Record<string, any>) {
    const result = onSearch ? await onSearch(values) : null
    return result
  }

  async function onFinish(values: Record<string, any>) {
    const res = await handleSearch(values)
    if (onAfterSearch) {
      await onAfterSearch(res)
    }
    return res
  }

  function handleReset() {
    if (onReset) {
      onReset(formInstance.current)
    }
    else {
      formInstance.current?.resetFields()
    }
  }

  return (
    <Collapse
      // defaultActiveKey={['1']}
      className={classNames('mb-15px')}
      style={{ backgroundColor: token.colorBgContainer }}
      items={[
        {
          key: '1',
          label: '搜索',
          children: (
            <BasicForm
              ref={formInstance}
              colProps={{ span: 6 }}
              onFinish={onFinish}
              onReset={handleReset}
              {...props}
            />
          ),
        },
      ]}
    />
  )
})
