import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Space } from 'antd'
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

  useEffect(() => {
    const paths = location.pathname.split('/').filter(Boolean)
    const currentPath = `/${paths.join('/')}`
    const currentMenu = menuMap[currentPath as keyof typeof menuMap]

    if (currentMenu) {
      const newBreadcrumbs: BreadcrumbItem[] = []

      // Build up breadcrumbs starting from first level
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

  return (
    <Space>
      <Space size={30}>
        <span className="cursor-pointer text-14px" onClick={() => onCollapse(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <span className="text-14px">
          {breadcrumbs.map((item, index) => (
            <span
              key={item.path}
              style={{
                color: item.path === location.pathname ? 'rgb(51, 54, 57)' : 'rgb(118, 124, 130)',
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
    </Space>
  )
}
