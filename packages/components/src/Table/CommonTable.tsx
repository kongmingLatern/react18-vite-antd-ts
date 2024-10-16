import { Table } from 'antd'
import React, { useState } from 'react'
import { http } from '@react18-vite-antd-ts/axios'
import { createExtensibleColumns } from './helpers/columns'
import { ColumnProps } from 'antd/es/table'
import { ColumnPropsWithCustomRender, ColumnPropsWithFormat } from './types'
import { useRequest } from 'ahooks'


export interface TableProps {
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
  }
}

export const CommonTable: React.FC<TableProps> = (props) => {
  const [tableColumns, setTableColumns] = useState<ColumnProps<any>[]>([])

  const { getUrl, columns, rowKey = 'id' } = props.dataCfg

  if (!getUrl) {
    throw new Error('getUrl is required')
  }

  const { data, loading } = useRequest<any, any>(() => http.get(getUrl), {
    onSuccess: () => {
      setTableColumns(createExtensibleColumns({ columns, dataCfg: props.dataCfg }))
    },
  })

  return (
    <>
      <Table
        columns={tableColumns}
        dataSource={data}
        rowKey={rowKey}
        pagination={{
          position: ['bottomRight']
        }}
        loading={loading}
      />
    </>
  )
}