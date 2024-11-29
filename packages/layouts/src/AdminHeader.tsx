import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Space } from 'antd'

interface AdminHeaderProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export default function AdminHeader(props: AdminHeaderProps) {
  const { collapsed, onCollapse } = props
  return (
    <Space>
      <span className="cursor-pointer" onClick={() => onCollapse(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </span>
    </Space>
  )
}
