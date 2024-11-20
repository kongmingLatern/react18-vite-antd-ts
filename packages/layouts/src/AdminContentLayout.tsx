import type { EnhanceFormItemConfig } from '@react18-vite-antd-ts/components/src/Form/types'
import type { CommonTableRef, ToolBarProps } from '@react18-vite-antd-ts/components/src/Table/CommonTable'
import type { FormInstance } from 'antd'
import type { SearchFormRef } from './components/SearchForm'
import { CommonTable, type CommonTableProps } from '@react18-vite-antd-ts/components'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ActionButtons } from './components/ActionButton'
import { SearchForm } from './components/SearchForm'

interface AdminContentLayoutProps {
  toolCfg?: ToolBarProps
  dataCfg?: CommonTableProps['dataCfg']
}

export interface AdminContentLayoutRef {
  getSearchFormRef: () => SearchFormRef
}

export const AdminContentLayout = forwardRef((props: AdminContentLayoutProps, ref) => {
  const { toolCfg = {} as ToolBarProps, dataCfg = {} as CommonTableProps['dataCfg'] } = props || {}
  const searchFormRef = useRef<SearchFormRef>(null)
  const tableRef = useRef<CommonTableRef>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    getSearchFormRef: () => searchFormRef.current,
    getTableRef: () => tableRef.current,
  }))

  const formItems: EnhanceFormItemConfig[] = [
    {
      type: 'input',
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
    },
    {
      type: 'number',
      name: 'age',
      label: '年龄',
      placeholder: '请输入年龄',
    },
    {
      type: 'select',
      name: 'sex',
      label: '性别',
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
    {
      type: 'input',
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
    },
    {
      type: 'number',
      name: 'age',
      label: '年龄',
      placeholder: '请输入年龄',
    },
    {
      type: 'select',
      name: 'sex',
      label: '性别',
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
    {
      type: 'input',
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
    },
    {
      type: 'number',
      name: 'age',
      label: '年龄',
      placeholder: '请输入年龄',
    },
    {
      type: 'select',
      name: 'sex',
      label: '性别',
      placeholder: '请选择性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  ]

  async function onSearch(values: Record<string, any>) {
    if (toolCfg.onSearch) {
      return toolCfg.onSearch(values)
    }

    const formData = searchFormRef.current?.getFormData()

    setSearchLoading(true)
    tableRef.current?.fetchData(dataCfg.getUrl, (params: Record<string, any>) => {
      return { ...params, ...formData }
    }).finally(() => {
      setSearchLoading(false)
    })

    return Promise.resolve(values)
  }

  function onReset(formInstance: FormInstance | null) {
    if (toolCfg.onReset) {
      return toolCfg.onReset(searchFormRef.current?.getFormData() || {}, {
        searchFormRef: searchFormRef.current,
        tableRef: tableRef.current,
      })
    }

    formInstance?.resetFields()
    setLoading(true)
    tableRef.current?.fetchData(dataCfg.getUrl).finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
      <SearchForm
        url=""
        ref={searchFormRef}
        formItems={formItems}
        onSearch={onSearch}
        onReset={onReset}
        submitText="搜索"
        submitBtnProps={{ loading: searchLoading }}
        resetBtnProps={{ loading }}
      />
      <ActionButtons />
      <CommonTable ref={tableRef} dataCfg={dataCfg} />
    </>
  )
})
