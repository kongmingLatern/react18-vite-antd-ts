import { defaultTheme } from '@react18-vite-antd-ts/theme'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import 'uno.css'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{ ...defaultTheme, hashed: false }} locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>,
)
