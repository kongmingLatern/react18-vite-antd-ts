import type { MenuProps } from 'antd'
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
import { Layout, Menu, theme } from 'antd'
import React, { useState } from 'react'

const { Header, Content, Footer, Sider } = Layout

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  // position: 'fixed',
  // insetInlineStart: 0,
  // top: 0,
  // bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
}

const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}))

export const AdminLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout hasSider>
      <Sider collapsible style={siderStyle} collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="text-white p-15px">123123</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          header
        </Header>
        <Content>
          123
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          footer
        </Footer>
      </Layout>
    </Layout>
  )
}
