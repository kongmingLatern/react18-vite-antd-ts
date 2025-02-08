import ErrorPage403 from '@/components/common/403'
import { theme } from 'antd'

export function Error403() {
  const { token } = theme.useToken()
  return (
    <div
      className="m-1rem box-border"
      style={{
        minHeight: 'calc(100vh - 220px)',
        backgroundColor: token.colorBgContainer,
      }}
    >
      <ErrorPage403 />
    </div>
  )
}
