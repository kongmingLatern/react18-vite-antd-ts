import { CommonTable } from '@react18-vite-antd-ts/components'
// 初始化路由
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { AdminLayout } from '../layout'
import Login from '../modules/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
        element: <CommonTable />,
      },
    ],
  },
])

export default router
