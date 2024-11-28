import { AdminLayout } from '@react18-vite-antd-ts/layouts'
// 初始化路由
import { createHashRouter, Navigate } from 'react-router-dom'
import Login from '../modules/Login'
import UserManagement from '../modules/System/UserManagement'
import TabPage from '../modules/SystemFunction/TabPage'

export const router = createHashRouter([
  {
    path: '/',
    element: <AdminLayout />,
    // 重定向
    children: [
      {
        index: true,
        element: <Navigate to="/index" replace />,
      },
      {
        path: 'index',
        element: <UserManagement />,
      },
      {
        path: 'system',
        element: <UserManagement />,
      },
      {
        path: 'system/tabs',
        element: <TabPage />,
      },
      {
        path: 'error',
        element: <UserManagement />,
      },
      {
        path: 'multi-level',
        element: <UserManagement />,
      },
      {
        path: 'management',
        element: <UserManagement />,
      },
      {
        path: 'about',
        element: <UserManagement />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export default router
