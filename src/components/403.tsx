import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

export default function Forbidden() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问该页面。"
      extra={<Button type="primary"><Link to="/">返回首页</Link></Button>}
    />
  )
}
