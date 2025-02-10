import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SkinOutlined, UserOutlined } from '@ant-design/icons'
import { themes, useTheme } from '@react18-vite-antd-ts/theme'

import { Avatar, Badge, Dropdown, Space, theme, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { menuMap } from './AdminBreadcrumb'

interface BreadcrumbItem {
  path: string
  label: string
  icon?: React.ReactNode
}

interface AdminHeaderProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export default function AdminHeader(props: AdminHeaderProps) {
  const { collapsed, onCollapse } = props
  const location = useLocation()
  const navigate = useNavigate()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const { toggleTheme, theme: currentTheme } = useTheme()
  const { token } = theme.useToken()

  // 从localStorage读取保存的主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      toggleTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const paths = location.pathname.split('/').filter(Boolean)
    const currentPath = `/${paths.join('/')}`
    const currentMenu = menuMap[currentPath as keyof typeof menuMap]

    if (currentMenu) {
      const newBreadcrumbs: BreadcrumbItem[] = []
      let currentBuildPath = ''
      for (let i = 0; i < paths.length; i++) {
        currentBuildPath += `/${paths[i]}`
        const menuItem = menuMap[currentBuildPath as keyof typeof menuMap]
        if (menuItem) {
          newBreadcrumbs.push({
            path: currentBuildPath,
            label: menuItem.label,
            icon: menuItem.icon,
          })
        }
      }
      setBreadcrumbs(newBreadcrumbs)
    }
  }, [location.pathname])

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人信息',
    },
    {
      key: 'settings',
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
    },
  ]

  return (
    <div className="flex justify-between items-center w-full px-5">
      <Space size={30}>
        <span className="cursor-pointer text-14px" onClick={() => onCollapse(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <span className="text-14px">
          {breadcrumbs.map((item, index) => (
            <span
              key={item.path}
              style={{
                color: item.path === location.pathname ? token.colorTextBase : token.colorTextSecondary,
                cursor: 'pointer',
              }}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="mx-1">{item.label}</span>
              {index < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </span>
      </Space>

      <Space size={16} className="items-center">
        <Dropdown
          trigger={['click']}
          menu={{
            selectable: true,
            selectedKeys: [Object.values(themes).find(t => t.theme === currentTheme)!.key],
            items: Object.values(themes).map(theme => ({
              key: theme.key,
              label: theme.label,
              icon: theme.icon,
            })),
            onClick: ({ key }) => {
              toggleTheme(key)
              // 保存主题到localStorage
              localStorage.setItem('theme', key)
            },
          }}
          placement="bottomRight"
          arrow
        >
          <Tooltip title="切换主题" placement="top">
            <SkinOutlined className="text-18px cursor-pointer" />
          </Tooltip>
        </Dropdown>

        <Tooltip title="消息通知">
          <Badge count={5} size="small">
            <BellOutlined
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                color: token.colorTextSecondary,
              }}
            />
          </Badge>
        </Tooltip>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Space className="cursor-pointer items-center">
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: token.colorPrimary,
                cursor: 'pointer',
              }}
            />
            <span className="hidden sm:inline text-15px">Admin</span>
          </Space>
        </Dropdown>
      </Space>
    </div>
  )
}
