import { AppstoreOutlined, BarChartOutlined, CloudOutlined, ShopOutlined, TeamOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { CommonMenu } from '@react18-vite-antd-ts/components'

const items = [
  { key: '1', icon: <UserOutlined />, label: 'User', path: '/user-management' },
  { key: '2', icon: <VideoCameraOutlined />, label: 'Video', path: '/video' },
  { key: '3', icon: <UploadOutlined />, label: 'Upload', path: '/upload' },
  { key: '4', icon: <BarChartOutlined />, label: 'Bar Chart', path: '/bar-chart' },
  { key: '5', icon: <CloudOutlined />, label: 'Cloud', path: '/cloud' },
  { key: '6', icon: <AppstoreOutlined />, label: 'App Store', path: '/app-store' },
  { key: '7', icon: <TeamOutlined />, label: 'Team', path: '/team' },
  { key: '8', icon: <ShopOutlined />, label: 'Shop', path: '/shop' },
]

function AdminMenu() {
  return <CommonMenu items={items} mode="inline" theme="dark" />
}

export default AdminMenu
