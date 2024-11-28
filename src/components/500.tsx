import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

export default function InternalServerError() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="抱歉，服务器出错了。"
      extra={<Button type="primary"><Link to="/">返回首页</Link></Button>}
    />
  )
}
