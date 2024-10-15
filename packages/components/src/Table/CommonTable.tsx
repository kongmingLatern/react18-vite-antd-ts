import type { TableProps } from 'antd'
import { Space, Table, Tag } from 'antd'
import React from 'react'
import { useDrawer } from '../Drawer/hooks/useDrawer'

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}


const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

export const CommonTable: React.FC = () => {
  const { showDrawer, DrawerComponent } = useDrawer()
  return (
    <>
      <Table<DataType> columns={
        [{
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
        ]} dataSource={data} />
      {DrawerComponent()}
    </>
  )
}