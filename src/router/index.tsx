// 初始化路由
import { createHashRouter, Navigate } from 'react-router-dom'
import UserManagement from '../components/UserManagement'
import { AdminLayout } from '../layout'
import Login from '../modules/Login'

export const router = createHashRouter([
  {
    path: '/',
    element: <AdminLayout />,
    // 重定向
    children: [
      {
        index: true,
        element: <Navigate to="/user-management" replace />,
      },
      {
        path: 'user-management',
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
