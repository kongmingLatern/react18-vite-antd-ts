import type { ReactNode } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, theme } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminBreadcrumb from './AdminBreadcrumb'
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

export const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const [marginLeft, setMarginLeft] = useState(200)

  const handleCollapse = (value: boolean) => {
    setCollapsed(value)
    setMarginLeft(value ? 80 : 200)
  }

  return (
    <Layout hasSider>
      <Sider style={siderStyle} collapsed={collapsed} onCollapse={value => handleCollapse(value)}>
        <div className="p-15px text-center">123123</div>
        <AdminMenu />
      </Sider>
      <Layout style={{ marginLeft, transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        <Header style={{ padding: 0, background: colorBgContainer, paddingLeft: 20, fontWeight: 600, fontSize: 20, borderBottom: '1px solid #e8e8e8' }}>
          <span className="cursor-pointer" onClick={() => handleCollapse(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </Header>
        <Content>
          <AdminBreadcrumb />
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', color: '#999' }}>
          &copy; 风之兮原 KongmingLatern 2024 版权所有
        </Footer>
      </Layout>
    </Layout>
  )
}
