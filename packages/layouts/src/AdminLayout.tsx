import type { ReactNode } from 'react'
import { CloseOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
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
}

const menuMap = {
  '/index': '首页',
  '/system/tabs': '标签页',
  '/error/403': '403',
  '/error/404': '404',
  '/error/500': '500',
  '/multi-level/first': '一级菜单',
  '/multi-level/second': '二级父菜单',
  '/multi-level/second/sub': '二级子菜单',
  '/management/user': '用户管理',
  '/about': '关于',
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
    const currentLabel = menuMap[currentPath as keyof typeof menuMap]

    if (currentLabel && !breadcrumbHistory.find(item => item.path === currentPath)) {
      setBreadcrumbHistory(prev => [...prev, { path: currentPath, label: currentLabel }])
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
      <div className={`min-w-90px text-gray-400 justify-center h-40px transition inline-flex items-center px-3 py-1 hover:text-purple-500 hover:bg-purple-50 ${location.pathname === item.path ? 'bg-purple-50 text-purple-700 rounded-tl-md rounded-tr-md' : 'bg-white rounded'}`}>
        <span
          className="cursor-pointer"
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </span>
        {breadcrumbHistory.length > 1 && (
          <CloseOutlined
            className="ml-2 cursor-pointer text-gray-400 hover:text-purple-500"
            onClick={() => handleCloseBreadcrumb(item.path, index)}
          />
        )}
      </div>
      {index !== breadcrumbHistory.length - 1 && (
        <span className="mx-2 text-gray-300 select-none">|</span>
      )}
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
            <Breadcrumb className="flex items-end w-full" style={{ margin: '0', height: '50px', paddingLeft: '20px' }} separator="">
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
