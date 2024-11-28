import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import type { AdminMenuItem } from './AdminMenu'
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, theme } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
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
}

const items: AdminMenuItem[] = [{
  key: '1',
  icon: <UserOutlined />,
  label: '用户管理',
  path: '/user-management',
}, {
  key: '2',
  icon: <VideoCameraOutlined />,
  label: '视频管理',
  path: '/video-management',
}]

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
      <Sider collapsible style={siderStyle} collapsed={collapsed} onCollapse={value => handleCollapse(value)}>
        <div className="text-white p-15px text-center">123123</div>
        <AdminMenu items={items} />
      </Sider>
      <Layout style={{ marginLeft, transition: 'margin-left 0.3s' }}>
        <Header style={{ padding: 0, background: colorBgContainer, paddingLeft: 20, fontWeight: 600, fontSize: 20 }}>
          header
        </Header>
        <Content style={{ margin: '24px 16px 0', background: colorBgContainer, padding: '15px' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', color: '#999' }}>
          &copy; 风之兮原 KongmingLatern 2024 版权所有
        </Footer>
      </Layout>
    </Layout>
  )
}
