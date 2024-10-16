import type { CommonTableProps } from '@react18-vite-antd-ts/components'
import { COLUMNTYPE } from '@react18-vite-antd-ts/components'
import { AdminContentLayout } from '@react18-vite-antd-ts/layouts'
import React from 'react'

const UserManagement: React.FC = () => {
  // Define your table columns and data here
  const dataCfg: CommonTableProps['dataCfg'] = {
    getUrl: 'https://jsonplaceholder.typicode.com/users',
    columns: [
      {
        title: 'id',
        key: 'id',
      },
      {
        title: '名字',
        key: 'name',
      },
      {
        title: '公司',
        key: 'company.name',
      },
      {
        type: COLUMNTYPE.TIME,
        title: '创建时间',
        key: 'createTime',
      },
      {
        title: '精度',
        key: 'address.geo.lat',
      },
      {
        title: '纬度',
        key: 'address.geo.lng',
      },
      {
        type: COLUMNTYPE.ACTION,
        maxVisible: (_, index) => {
          return index % 2 === 0 ? 1 : 4
        },
        defaultActionCfg: {
          viewCfg: {
            text: (record) => {
              return `查看${record.id}`
            },
          },
          editCfg: {
            text: (record, index) => {
              return `编辑${record.id}${index + 3}`
            },
          },
          deleteCfg: {
            text: (record, index) => {
              return `删除${record.id}${index}`
            },
          },
        },
        actions: [
          {
            text: (record) => {
              return `自定义渲染${record.id}`
            },
            danger: true,
            hidden: (record) => {
              return record.id % 2 === 0
            },
            onClick: (record) => {
              console.log('record', record)
            },
          },
        ],
      },
    ],
  }

  return <AdminContentLayout dataCfg={dataCfg} />
}

export default UserManagement
