import type { ReactNode } from 'react'
import { Layout, theme } from 'antd'
import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import AdminBreadcrumb from './AdminBreadcrumb'
import AdminHeader from './AdminHeader'
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
    token: { colorBgContainer, colorText },
  } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const [marginLeft, setMarginLeft] = useState(200)
  const location = useLocation()

  const handleCollapse = (value: boolean) => {
    setCollapsed(value)
    setMarginLeft(value ? 80 : 200)
  }

  return (
    <Layout hasSider>
      <Sider style={siderStyle} collapsed={collapsed} onCollapse={value => handleCollapse(value)}>
        <div className="p-15px text-center" style={{ color: colorText, backgroundColor: colorBgContainer }}>
          123123
        </div>
        <AdminMenu />
      </Sider>
      <Layout style={{ marginLeft, transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        <Header style={{ padding: 0, background: colorBgContainer, paddingLeft: 20, fontWeight: 600, fontSize: 20, borderBottom: '1px solid #e8e8e8' }}>
          <AdminHeader collapsed={collapsed} onCollapse={handleCollapse} />
        </Header>
        <Content>
          <AdminBreadcrumb />
          <div className="fade-transition">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={location.pathname}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                <Outlet />
              </CSSTransition>
            </SwitchTransition>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#999' }}>
          &copy; 风之兮原 KongmingLatern 2025 版权所有
        </Footer>
      </Layout>
    </Layout>
  )
}
