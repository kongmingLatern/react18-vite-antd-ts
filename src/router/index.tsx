import { AdminLayout } from '@react18-vite-antd-ts/layouts'
import { Error403 } from '../modules/Error/Error403'
import { Error404 } from '../modules/Error/Error404'
import { Error500 } from '../modules/Error/Error500'
// 初始化路由
import { createHashRouter, Navigate } from 'react-router-dom'
import Deepseek from '../modules/Deepseek'
import Index from '../modules/Index/index'
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
        element: <Index />,
      },
      {
        path: 'deepseek',
        element: <Deepseek />,
      },
      {
        path: 'multi-level/first',
        element: <div>一级菜单</div>,
      },
      {
        path: 'multi-level/second',
        element: <div>二级父菜单</div>,
      },
      {
        path: 'multi-level/second/sub',
        element: <div>二级子菜单</div>,
      },
      {
        path: 'system/tabs',
        element: <TabPage />,
      },
      {
        path: 'error/403',
        element: <Error403 />,
      },
      {
        path: 'error/404',
        element: <Error404 />,
      },
      {
        path: 'error/500',
        element: <Error500 />,
      },
      {
        path: 'management/user',
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
