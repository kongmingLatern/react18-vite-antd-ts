import ErrorPage404 from '@/components/common/404'
import { theme } from 'antd'

export function Error404() {
  const { token } = theme.useToken()
  return (
    <div
      className="m-1rem box-border"
      style={{
        minHeight: 'calc(100vh - 220px)',
        backgroundColor: token.colorBgContainer,
      }}
    >
      <ErrorPage404 />
    </div>
  )
}
