import type { FormInstance } from 'antd'
import { BasicForm, type BasicFormProps } from '@react18-vite-antd-ts/components'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

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

export interface SearchFormRef {
  formInstance: FormInstance
  getFormData: () => Record<string, any>
}

export const SearchForm = forwardRef((props: SearchFormProps, ref) => {
  const { onSearch, onAfterSearch, onReset } = props
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
    <BasicForm
      ref={formInstance}
      onFinish={onFinish}
      onReset={handleReset}

      {...props}
    />
  )
})
