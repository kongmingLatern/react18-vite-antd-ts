import { CloudServerOutlined, FileTextOutlined, HomeOutlined, InfoCircleOutlined, LockOutlined, MenuFoldOutlined, SettingOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { CommonMenu } from '@react18-vite-antd-ts/components'

const items = [
  {
    key: '/index',
    icon: <HomeOutlined />,
    label: '首页',
    path: '/index',
  },
  {
    key: '/system',
    icon: <SettingOutlined />,
    label: '系统功能',
    // path: '/system',
    children: [
      { key: '/system/tabs', icon: <FileTextOutlined />, label: '标签页', path: '/system/tabs' },
      { key: '/system/hide', icon: <LockOutlined />, label: '隐藏子菜单', path: '/system/hide' },
      { key: '/system/params', icon: <UserOutlined />, label: '请求参数', path: '/system/params' },
    ],
  },
  {
    key: '3',
    icon: <WarningOutlined />,
    label: '异常页',
    // path: '/error',
    children: [
      { key: '/error/404', icon: <FileTextOutlined />, label: '404', path: '/error/404' },
      { key: '/error/403', icon: <LockOutlined />, label: '403', path: '/error/403' },
    ],
  },
  {
    key: '4',
    icon: <MenuFoldOutlined />,
    label: '多级菜单',
    // path: '/multi-level',
    children: [
      { key: '4-1', icon: <FileTextOutlined />, label: '一级菜单', path: '/multi-level/first' },
      { key: '4-2', icon: <UserOutlined />, label: '二级菜单', path: '/multi-level/second' },
      { key: '4-3', icon: <LockOutlined />, label: '三级菜单', path: '/multi-level/third' },
    ],
  },
  {
    key: '5',
    icon: <CloudServerOutlined />,
    label: '系统管理',
    // path: '/management',
    children: [
      { key: '5-1', icon: <UserOutlined />, label: '用户管理', path: '/management/user' },
      { key: '5-2', icon: <LockOutlined />, label: '角色管理', path: '/management/role' },
    ],
  },
  { key: '6', icon: <InfoCircleOutlined />, label: '关于', path: '/about' },
]

function AdminMenu() {
  return <CommonMenu items={items} mode="inline" theme="light" />
}

export default AdminMenu
