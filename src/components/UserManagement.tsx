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
        defaultActionCfg: {
          viewCfg: {
            key: 'view',
            text: '查看',
            hidden: (row) => {
              console.log('row', row)
              return false
            },
          },
        },
      },
    ],
  }

  return <AdminContentLayout dataCfg={dataCfg} />
}

export default UserManagement
