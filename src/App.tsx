import { defaultTheme } from '@react18-vite-antd-ts/theme'
import { ConfigProvider } from 'antd'

function App() {
  return (
    <ConfigProvider theme={defaultTheme}>
      {/* 你的应用内容 */}
    </ConfigProvider>
  )
}

export default App
