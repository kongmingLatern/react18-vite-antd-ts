import type { CommonTableRef } from '@react18-vite-antd-ts/components/src/Table/CommonTable'
import type { AdminContentLayoutProps, ToolBarProps } from '@react18-vite-antd-ts/types'
import type { SearchFormRef } from './components/SearchForm'
import { CommonTable, type CommonTableProps } from '@react18-vite-antd-ts/components'
import { type FormInstance, theme } from 'antd'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ActionButtons } from './components/ActionButton'
import { SearchForm } from './components/SearchForm'

export const AdminContentLayout = forwardRef((props: AdminContentLayoutProps, ref) => {
  const { toolCfg = {} as ToolBarProps, dataCfg = {} as CommonTableProps['dataCfg'] } = props || {}
  const { actionButtonCfg = {} as ToolBarProps['actionButtonCfg'] } = toolCfg || {}
  const { token } = theme.useToken()
  const searchFormRef = useRef<SearchFormRef>(null)
  const tableRef = useRef<CommonTableRef>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    getSearchFormRef: () => searchFormRef.current,
    getTableRef: () => tableRef.current,
  }))

  async function onSearch(values: Record<string, any>) {
    if (toolCfg?.searchFormCfg?.onSearch) {
      return toolCfg.searchFormCfg.onSearch(values)
    }

    const formData = searchFormRef.current?.getFormData()

    setSearchLoading(true)
    await tableRef.current?.fetchData(dataCfg.getUrl, (params: Record<string, any>) => {
      const combineParams = toolCfg?.searchFormCfg?.onBeforeSearch
        ? toolCfg.searchFormCfg.onBeforeSearch({
          ...params,
          ...formData,
        })
        : { ...params, ...formData }
      return combineParams
    }).finally(() => {
      setSearchLoading(false)
    })

    return Promise.resolve(values)
  }

  async function onReset(formInstance: FormInstance | null) {
    if (toolCfg?.searchFormCfg?.onReset) {
      return await toolCfg.searchFormCfg.onReset(searchFormRef.current?.getFormData() || {}, {
        searchFormRef: searchFormRef.current,
        tableRef: tableRef.current,
      })
    }

    formInstance?.resetFields()
    setLoading(true)
    await tableRef.current?.fetchData(dataCfg.getUrl, (params) => {
      const formData = searchFormRef.current?.getFormData() || {}
      return {
        ...params,
        ...formData,
        page: 1,
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  function onPaginationChange(current: number, pageSize: number, args: { filters: any, sorter: any, extra: { currentDataSource: any[], action: 'paginate' | 'sort' | 'filter' } }) {
    tableRef.current?.fetchData(dataCfg.getUrl, (params: Record<string, any>) => {
      const formData = searchFormRef.current?.getFormData() || {}
      const combineParams = toolCfg?.searchFormCfg?.onBeforeSearch
        ? toolCfg.searchFormCfg.onBeforeSearch({
          ...params,
          ...formData,
          page: current,
          pageSize,
        })
        : { ...params, ...formData, page: current, pageSize }
      return combineParams
    })
  }

  function onFirstFetch(params: Record<string, any>) {
    const formData = searchFormRef.current?.getFormData() || {}
    return {
      ...params,
      ...formData,
    }
  }

  return (
    <div className="box-border m-16px p-1rem overflow-hidden" style={{ backgroundColor: token.colorBgContainer }}>
      <SearchForm
        ref={searchFormRef}
        onSearch={onSearch}
        onReset={onReset}
        submitText="搜索"
        submitBtnProps={{ loading: searchLoading }}
        resetBtnProps={{ loading }}
        {...toolCfg?.searchFormCfg?.searchFormProps}
      />
      <ActionButtons actionButtonCfg={actionButtonCfg} />
      <CommonTable ref={tableRef} dataCfg={dataCfg} onPaginationChange={onPaginationChange} onFirstFetch={onFirstFetch} {...dataCfg?.tableProps} />
    </div>
  )
})
