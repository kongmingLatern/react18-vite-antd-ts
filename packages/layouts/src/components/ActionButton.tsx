import { useDrawer } from '@react18-vite-antd-ts/hooks'
import { Button, Space } from 'antd'

export function ActionButtons() {
  const { showDrawer, DrawerComponent } = useDrawer()
  return (
    <>
      <Space className="flex justify-end w-full mb-15px">
        <Button type="primary" onClick={() => showDrawer({ title: '新增用户', content: <div>123</div> })}>
          新增用户
        </Button>
        <Button>导出</Button>
      </Space>
      {DrawerComponent()}
    </>
  )
}
