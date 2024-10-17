import type { ColumnProps, TableProps } from 'antd/es/table'
import type { ColumnPropsWithCustomRender, ColumnPropsWithFormat } from './types'
import { http } from '@react18-vite-antd-ts/axios'
import { useRequest } from 'ahooks'
import { Table } from 'antd'
import React, { useState } from 'react'
import { createExtensibleColumns } from './helpers/columns'

export interface CommonTableProps {
  dataCfg: {
    /**
     * 行键， 默认为 id
     */
    rowKey?: string
    /**
     * 后台请求地址
     */
    getUrl?: string
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
    pagination?: {
      pageSize?: number
      current?: number
      total?: number
      onChange?: (page: number, pageSize: number) => void
    }
    /**
     * 表格配置
     */
    tableProps?: TableProps<any>
  }
}

export const CommonTable: React.FC<CommonTableProps> = (props) => {
  const [tableColumns, setTableColumns] = useState<ColumnProps<any>[]>([])
  const [pagination, setPagination] = useState({
    current: props.dataCfg.pagination?.current || 1,
    pageSize: props.dataCfg.pagination?.pageSize || 10,
    total: props.dataCfg.pagination?.total || 0,
  })

  const { getUrl, columns, rowKey = 'id' } = props.dataCfg

  if (!getUrl) {
    throw new Error('getUrl is required')
  }

  const { data, loading } = useRequest<any, any>(
    () =>
      http.get(getUrl, {
        params: { page: pagination.current, pageSize: pagination.pageSize },
      }),
    {
      refreshDeps: [pagination.current, pagination.pageSize],
      onSuccess: (result) => {
        setTableColumns(
          createExtensibleColumns({ columns, dataCfg: props.dataCfg }),
        )
        setPagination(prev => ({ ...prev, total: result.total }))
      },
    },
  )

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }))
    props.dataCfg.pagination?.onChange?.(
      newPagination.current,
      newPagination.pageSize,
    )
  }

  return (
    <>
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
        {...props.dataCfg.tableProps}
      />
    </>
  )
}
