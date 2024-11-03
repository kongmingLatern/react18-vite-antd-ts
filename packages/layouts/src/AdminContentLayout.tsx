import type { EnhanceFormItemConfig } from '@react18-vite-antd-ts/components/src/Form/types'
import { CommonTable, type CommonTableProps } from '@react18-vite-antd-ts/components'
import { ActionButtons } from './components/ActionButton'
import { SearchForm } from './components/SearchForm'

interface AdminContentLayoutProps {
  dataCfg: CommonTableProps['dataCfg']
}

export function AdminContentLayout(props: AdminContentLayoutProps) {
  const { dataCfg } = props

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

  return (
    <>
      <SearchForm formItems={formItems} footer />
      <ActionButtons />
      <CommonTable dataCfg={dataCfg} />
    </>
  )
}
