import type { FormInstance } from 'antd'
import { BasicForm, type BasicFormProps } from '@react18-vite-antd-ts/components'
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface SearchFormProps extends Omit<BasicFormProps, 'onFinish'> {
  /**
   * 请求查询默认地址
   */
  searchUrl?: string

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
  onReset?: () => void

}

export interface SearchFormRef {
  formInstance: FormInstance
  getFormData: () => Record<string, any>
}

export const SearchForm = forwardRef((props: SearchFormProps, ref) => {
  const { onSearch, onAfterSearch } = props
  const formInstance = useRef<FormInstance>(null)

  useImperativeHandle(ref, () => ({
    formInstance,
    getFormData: () => formInstance.current?.getFieldsValue(),
  }))

  async function handleSearch(values: Record<string, any>) {
    return onSearch && await onSearch(values)
  }

  async function onFinish(values: Record<string, any>) {
    const res = await handleSearch(values)
    onAfterSearch && await onAfterSearch(res)
  }

  function onFinishFailed(errorInfo: any) {
    console.log('onFinishFailed', errorInfo)
  }

  return (
    <BasicForm
      ref={formInstance}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      {...props}
    />
  )
})
