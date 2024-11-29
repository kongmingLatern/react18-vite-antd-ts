import type { ReactNode } from 'react'
import { CloseOutlined, HomeOutlined, InfoCircleOutlined, MenuOutlined, TagsOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface BreadcrumbItem {
  path: string
  label: string
  icon?: ReactNode
}

export const menuMap = {
  '/index': { label: '首页', icon: <HomeOutlined /> },
  '/system/tabs': { label: '标签页', icon: <TagsOutlined /> },
  '/error/403': { label: '403', icon: <WarningOutlined /> },
  '/error/404': { label: '404', icon: <WarningOutlined /> },
  '/error/500': { label: '500', icon: <WarningOutlined /> },
  '/multi-level/first': { label: '一级菜单', icon: <MenuOutlined /> },
  '/multi-level/second': { label: '二级父菜单', icon: <MenuOutlined /> },
  '/multi-level/second/sub': { label: '二级子菜单', icon: <MenuOutlined /> },
  '/management/user': { label: '用户管理', icon: <UserOutlined /> },
  '/about': { label: '关于', icon: <InfoCircleOutlined /> },
}

const AdminBreadcrumb: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [breadcrumbHistory, setBreadcrumbHistory] = useState<BreadcrumbItem[]>([])

  useEffect(() => {
    const paths = location.pathname.split('/').filter(Boolean)
    const currentPath = `/${paths.join('/')}`
    const currentMenu = menuMap[currentPath as keyof typeof menuMap]

    if (currentMenu && !breadcrumbHistory.find(item => item.path === currentPath)) {
      setBreadcrumbHistory(prev => [...prev, { path: currentPath, label: currentMenu.label, icon: currentMenu.icon }])
    }
  }, [location.pathname])

  const handleCloseBreadcrumb = (path: string, index: number) => {
    if (breadcrumbHistory.length > 1) {
      const newHistory = breadcrumbHistory.filter((_, i) => i !== index)
      setBreadcrumbHistory(newHistory)

      if (location.pathname === path) {
        // Navigate to the previous path if closing current page
        const lastItem = newHistory[newHistory.length - 1]
        navigate(lastItem.path)
      }
    }
  }

  return (
    <div className="w-full bg-white">
      <Breadcrumb
        className="flex items-end w-full"
        style={{ margin: '0', height: '50px', paddingLeft: '20px' }}
        separator={<span className="text-gray-300 h-full select-none flex items-center">|</span>}
      >
        {breadcrumbHistory.map((item, index) => (
          <Breadcrumb.Item key={item.path}>
            <div
              className={`min-w-90px text-gray-400 justify-center h-40px cursor-pointer transition inline-flex items-center px-3 py-1 hover:text-purple-500 hover:bg-purple-50 ${
                location.pathname === item.path ? 'bg-purple-50 text-purple-700 rounded-tl-md rounded-tr-md' : 'bg-white rounded'
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon && <span className="mr-1rem">{item.icon}</span>}
              <span>{item.label}</span>
              {breadcrumbHistory.length > 1 && (
                <CloseOutlined
                  className="ml-2 cursor-pointer text-gray-400 hover:text-purple-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCloseBreadcrumb(item.path, index)
                  }}
                />
              )}
            </div>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  )
}

export default AdminBreadcrumb
