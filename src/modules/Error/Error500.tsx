import ErrorPage500 from '@/components/common/500'
import { theme } from 'antd'

export function Error500() {
  const { token } = theme.useToken()
  return (
    <div
      className="m-1rem box-border"
      style={{
        minHeight: 'calc(100vh - 220px)',
        backgroundColor: token.colorBgContainer,
      }}
    >
      <ErrorPage500 />
    </div>
  )
}
