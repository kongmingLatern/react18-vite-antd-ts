import { COLUMNTYPE, CommonTable } from '@react18-vite-antd-ts/components'
// 初始化路由
import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../layout'
import Login from '../modules/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <CommonTable
            dataCfg={{
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
                  actions: [
                    {
                      text: '查看',
                      onClick: (record) => {
                        console.log(record)
                      },
                    },
                  ],
                },
              ],
            }}
          />
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <CommonTable
            dataCfg={{
              getUrl: 'https://jsonplaceholder.typicode.com/users',
              columns: [
                {
                  type: COLUMNTYPE.INDEX,
                },
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
                  title: '精度',
                  key: 'address.geo.lat',
                },
                {
                  title: '纬度',
                  key: 'address.geo.lng',
                },
                {
                  type: COLUMNTYPE.ACTION,
                  actions: [
                    {
                      text: '启用',
                      needConfirm: true,
                      onClick: (record) => {
                        console.log(record)
                      },
                      index: 2,
                    },
                    {
                      text: '新增子部门',
                      onClick: (record) => {
                        console.log(record)
                      },
                    },
                    {
                      text: '编辑123',
                      render: (action, record) => {
                        console.log(action, record)
                        return <a>编辑123</a>
                      },
                      index: 1,
                    },
                  ],
                },
              ],
            }}
          />
        ),
      },
    ],
  },
])

export default router
