import type { ToolBarProps } from '@react18-vite-antd-ts/types'
import type { ColumnProps, TableProps } from 'antd/es/table'
import type { ColumnPropsWithCustomRender, ColumnPropsWithFormat } from './types'
import { http } from '@react18-vite-antd-ts/axios'
import { useRequest } from 'ahooks'
import { Table } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { createExtensibleColumns } from './helpers/columns'

interface PaginationType {
  pageSize?: number
  current?: number
  total?: number
  onChange?: (page: number, pageSize: number) => void
}

export interface CommonTableProps {
  dataCfg: {
    /**
     * 行键， 默认为 id
     */
    rowKey?: string
    /**
     * 后台请求地址
     */
    getUrl: string

    /**
     * getParams，默认携带的参数
     */
    getParams?: (pagination: PaginationType) => Record<string, any> | Promise<Record<string, any>>

    /**
     * 是否分页查询，默认为 true
     */
    isPageQuery?: boolean

    /**
     * formatData，格式化数据
     */
    formatData?: (data: any[]) => any[]

    /**
     * 列配置
     */
    columns: (ColumnPropsWithFormat & ColumnPropsWithCustomRender)[]
    /**
     * 是否显示操作列，默认为 false
     */
    showAction?: boolean
    /**
     * 分页配置
     */
    pagination?: PaginationType
    /**
     * 表格配置
     */
    tableProps?: TableProps<any>
  }
  onPaginationChange?: (current: number, pageSize: number, args: {
    filters: any
    sorter: any
    extra: {
      currentDataSource: any[]
      action: 'paginate' | 'sort' | 'filter'
    }
  }) => void
  onFirstFetch?: (params: Record<string, any>) => Record<string, any>
}

type ParamsType = Record<string, any> | ((params: Record<string, any>) => Record<string, any>)

export interface CommonTableRef {
  fetchData: (url: string, params?: ParamsType) => Promise<void>
}

export const CommonTable = forwardRef((props: CommonTableProps, ref) => {
  const { dataCfg, onPaginationChange, onFirstFetch } = props
  const { columns, getParams, rowKey = 'id', isPageQuery = true, pagination: paginationCfg } = dataCfg

  const [tableColumns, setTableColumns] = useState<ColumnProps<any>[]>([])
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [pagination, setPagination] = useState<PaginationType>({
    current: paginationCfg?.current || 1,
    pageSize: paginationCfg?.pageSize || 2,
    total: paginationCfg?.total || 0,
  })

  const fetchData = async (url: string, additionalParams: ParamsType = {}) => {
    try {
      setLoading(true)
      const baseParams = await (typeof getParams === 'function' ? getParams(pagination) : {})
      const initialParams = {
        ...baseParams,
        ...(isPageQuery ? { page: pagination.current, pageSize: pagination.pageSize } : {}),
      }

      const resolvedParams = typeof additionalParams === 'function'
        ? additionalParams(initialParams)
        : additionalParams

      const newPaginationParams = { ...initialParams, ...resolvedParams }
      const result = await http.get(url, {
        params: newPaginationParams,
      })

      setData(dataCfg.formatData?.(result) || result)
      setPagination(prev => ({
        ...prev,
        total: result.total,
        current: newPaginationParams.page || prev.current,
        pageSize: newPaginationParams.pageSize || prev.pageSize,
      }))

      setTableColumns(createExtensibleColumns({ columns, dataCfg, pagination: newPaginationParams }))
    }
    catch (error) {
      console.error('Failed to fetch data:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const { run: refreshData } = useRequest(
    () => fetchData(dataCfg.getUrl, (params) => {
      const formData = onFirstFetch && onFirstFetch(params)
      return {
        ...params,
        ...formData,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
    }),
    {
      refreshDeps: [pagination.current, pagination.pageSize],
      manual: true,
    },
  )

  useEffect(() => {
    refreshData()
  }, [refreshData])

  useImperativeHandle(ref, () => ({
    fetchData,
  }))

  const handleTableChange = (newPagination: any, filters: any, sorter: any, extra: { currentDataSource: any[], action: 'paginate' | 'sort' | 'filter' }) => {
    const { action } = extra

    if (action === 'paginate') {
      onPaginationChange && onPaginationChange(newPagination.current, newPagination.pageSize, { filters, sorter, extra })
    }
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }))

    dataCfg.pagination?.onChange?.(
      newPagination.current,
      newPagination.pageSize,
    )
  }

  return (
    <Table
      columns={tableColumns}
      dataSource={data}
      rowKey={rowKey}
      pagination={{
        ...pagination,
        position: ['bottomRight'],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
      }}
      loading={loading}
      onChange={handleTableChange}
      {...dataCfg.tableProps}
    />
  )
})
