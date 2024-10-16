import { Table } from 'antd'
import React, { useState } from 'react'
import { useDrawer } from '@react18-vite-antd-ts/hooks'
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
    getUrl?: string
    columns: (ColumnPropsWithFormat & ColumnPropsWithCustomRender)[]
    /**
     * 是否显示序号，默认为 false
     */
    showIndex?: boolean
  }
}

export const CommonTable: React.FC<TableProps> = (props) => {
  const { DrawerComponent } = useDrawer()
  const [tableColumns, setTableColumns] = useState<ColumnProps<any>[]>([])

  const { getUrl, columns, rowKey = 'id' } = props.dataCfg

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
      {DrawerComponent()}
    </>
  )
}