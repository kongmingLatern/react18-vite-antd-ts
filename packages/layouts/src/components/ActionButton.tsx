import { Button, Space } from 'antd'

export function ActionButtons() {
  return (
    <Space className="flex justify-end w-full mb-15px">
      <Button type="primary">新增用户</Button>
      <Button>导出</Button>
    </Space>
  )
}
