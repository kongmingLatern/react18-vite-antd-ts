import type { ReactNode } from 'react'
import { CloseOutlined, HomeOutlined, InfoCircleOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, TagsOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { Breadcrumb, Layout, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AdminMenu from './AdminMenu'

const { Header, Content, Footer, Sider } = Layout

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
  backgroundColor: '#fff',
}

interface AdminLayoutProps {
  searchForm?: ReactNode
  actionButtons?: ReactNode
}

interface BreadcrumbItem {
  path: string
  label: string
  icon?: ReactNode
}

const menuMap = {
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

export const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const [marginLeft, setMarginLeft] = useState(200)
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

  const handleCollapse = (value: boolean) => {
    setCollapsed(value)
    setMarginLeft(value ? 80 : 200)
  }

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

  const breadcrumbItems = breadcrumbHistory.map((item, index) => (
    <Breadcrumb.Item key={item.path}>
      <div className={`min-w-90px text-gray-400 justify-center h-40px cursor-pointer transition inline-flex items-center px-3 py-1 hover:text-purple-500 hover:bg-purple-50 ${location.pathname === item.path ? 'bg-purple-50 text-purple-700 rounded-tl-md rounded-tr-md' : 'bg-white rounded'}`} onClick={() => navigate(item.path)}>
        {item.icon && <span className="mr-1rem">{item.icon}</span>}
        <span>
          {item.label}
        </span>
        {breadcrumbHistory.length > 1 && (
          <CloseOutlined
            className="ml-2 cursor-pointer text-gray-400 hover:text-purple-500"
            onClick={() => handleCloseBreadcrumb(item.path, index)}
          />
        )}
      </div>
    </Breadcrumb.Item>
  ))

  return (
    <Layout hasSider>
      <Sider style={siderStyle} collapsed={collapsed} onCollapse={value => handleCollapse(value)}>
        <div className="p-15px text-center">123123</div>
        <AdminMenu />
      </Sider>
      <Layout style={{ marginLeft, transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        <Header style={{ padding: 0, background: colorBgContainer, paddingLeft: 20, fontWeight: 600, fontSize: 20, borderBottom: '1px solid #e8e8e8' }}>
          <span className="cursor-pointer" onClick={() => handleCollapse(!collapsed)}>{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </Header>
        <Content>
          <div className="w-full bg-white">
            <Breadcrumb className="flex items-end w-full" style={{ margin: '0', height: '50px', paddingLeft: '20px' }} separator={<span className="text-gray-300 h-full select-none flex items-center">|</span>}>
              {breadcrumbItems}
            </Breadcrumb>
          </div>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', color: '#999' }}>
          &copy; 风之兮原 KongmingLatern 2024 版权所有
        </Footer>
      </Layout>
    </Layout>
  )
}
