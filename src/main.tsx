import { ThemeProvider, useTheme } from '@react18-vite-antd-ts/theme'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import 'uno.css'
import './index.scss'

function App() {
  const { currentTheme } = useTheme()
  console.log('currentTheme', currentTheme)

  return (
    <ThemeProvider>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: currentTheme.algorithm,
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
