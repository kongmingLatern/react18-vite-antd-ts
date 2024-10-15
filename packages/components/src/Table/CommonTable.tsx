import { Space, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDrawer } from '@react18-vite-antd-ts/hooks'
import { http } from '@react18-vite-antd-ts/axios'
import { ColumnPropsWithFormatTime, createColumns } from './helpers/columns'
import { ColumnProps } from 'antd/es/table'

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

interface TableProps {
  dataCfg: {
    getUrl?: string
    columns: ColumnPropsWithFormatTime[]
  }
}

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a>{text}</a>,
},
{
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
},
{
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
},
{
  title: 'Tags',
  key: 'tags',
  dataIndex: 'tags',
  render: (_, { tags }) => (
    <>
      {tags.map((tag) => {
        let color = tag.length > 5 ? 'geekblue' : 'green'
        if (tag === 'loser') {
          color = 'volcano'
        }
        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        )
      })}
    </>
  ),
},
{
  title: 'Action',
  key: 'action',
  render: (_, record) => {
    return (
      <Space size="middle">
        <a onClick={() => {

          showDrawer(<div>123</div>)
        }}>
          Invite
          {record.name}
        </a>
        <a>Delete</a>
      </Space>
    )
  },
},
]

export const CommonTable: React.FC<TableProps> = (props) => {
  const [data, setData] = useState<DataType[]>([])
  const { DrawerComponent } = useDrawer()
  const { getUrl, columns } = props.dataCfg

  useEffect(() => {
    async function fetchData() {
      // 模拟 获取数据
      const res = await http.get(getUrl)
      setData(res.data)
    }

    fetchData()
  }, [])

  return (
    <>
      <Table<DataType> columns={createColumns({ columns }) as ColumnProps<DataType>[]} dataSource={data} />
      {DrawerComponent()}
    </>
  )
}