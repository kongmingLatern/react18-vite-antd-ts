// 初始化路由
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
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
])

export default router
