import type { EnhanceFormItemConfig } from '@react18-vite-antd-ts/components/src/Form/types'
import type { FormInstance } from 'antd'
import type { SearchFormRef } from './components/SearchForm'
import { CommonTable, type CommonTableProps } from '@react18-vite-antd-ts/components'
import { useEffect, useRef } from 'react'
import { ActionButtons } from './components/ActionButton'
import { SearchForm } from './components/SearchForm'

interface AdminContentLayoutProps {
  dataCfg: CommonTableProps['dataCfg']
}

export function AdminContentLayout(props: AdminContentLayoutProps) {
  const { dataCfg } = props
  const searchFormRef = useRef<SearchFormRef>(null)

  const formItems: EnhanceFormItemConfig[] = [
    {
      type: 'input',
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
    },

    {
      type: 'input',
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
    },
    {
      type: 'input',
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
    },
  ]

  async function onSearch(values: Record<string, any>) {
    console.log('onSearch', values)
    console.log('searchFormRef', searchFormRef.current?.getFormData())
    return Promise.resolve(values)
  }

  useEffect(() => {
  }, [])

  function onFinishFailed(errorInfo: any) {
    console.log('onFinishFailed', errorInfo)
  }

  return (
    <>
      <SearchForm formItems={formItems} footer onSearch={onSearch} ref={searchFormRef} />

      <ActionButtons />
      <CommonTable dataCfg={dataCfg} />
    </>
  )
}
