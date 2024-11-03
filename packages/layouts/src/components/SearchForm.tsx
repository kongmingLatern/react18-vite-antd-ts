import type { EnhanceFormItemConfig } from '@react18-vite-antd-ts/components/src/Form/types'
import { BasicForm, type BasicFormProps } from '@react18-vite-antd-ts/components'
import { useEffect, useRef } from 'react'

interface SearchFormProps extends Pick<BasicFormProps, 'footer' | 'formProps'> {
  /**
   * 请求查询默认地址
   */
  searchUrl?: string

  /**
   * 表单配置项
   */
  formItems: EnhanceFormItemConfig[]

  /**
   * 搜索回调
   */
  onSearch?: (values: any) => Promise<any>

  /**
   * 搜索完成后回调
   */
  onAfterSearch?: (res: Record<string, any>) => Promise<void>

  /**
   * 重置回调
   */
  onReset?: () => void

}

export function SearchForm(props: SearchFormProps) {
  const { onSearch, onAfterSearch } = props
  const formInstance = useRef(null)

  async function handleSearch(values: Record<string, any>) {
    return onSearch && await onSearch(values)
  }

  async function onFinish(values: Record<string, any>) {
    const res = await handleSearch(values)
    onAfterSearch && await onAfterSearch(res)
  }

  return (
    <BasicForm
      ref={formInstance}
      onFinish={onFinish}
      {...props}
    />
  )
}
