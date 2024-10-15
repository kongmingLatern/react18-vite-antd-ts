import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDrawer } from '@react18-vite-antd-ts/hooks'
import { http } from '@react18-vite-antd-ts/axios'
import { createColumns } from './helpers/columns'
import { ColumnProps } from 'antd/es/table'
import { ColumnPropsWithFormatTime } from './types'


interface TableProps {
  dataCfg: {
    getUrl?: string
    columns: ColumnPropsWithFormatTime[]
  }
}

export const CommonTable: React.FC<TableProps> = (props) => {
  const [data, setData] = useState<[]>([])
  const { DrawerComponent } = useDrawer()
  const { getUrl, columns } = props.dataCfg
  const [tableColumns, setTableColumns] = useState<ColumnProps<any>[]>([])

  useEffect(() => {
    async function fetchData() {
      // 模拟 获取数据
      const res = await http.get(getUrl)
      setData(res)
      console.log(createColumns({ columns, data: res }));
      
      setTableColumns(createColumns({ columns, data: res }))
    }

    fetchData()

  }, [])


  return (
    <>
      <Table columns={tableColumns} dataSource={data} rowKey={'id'} />
      {DrawerComponent()}
    </>
  )
}