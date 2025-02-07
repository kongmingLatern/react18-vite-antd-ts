import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export interface CommonMenuItem {
  key: string
  icon: React.ReactNode
  label: string | React.ReactNode
  path?: string
  children?: CommonMenuItem[]
}

export interface CommonMenuProps {
  items: CommonMenuItem[]
  mode?: 'vertical' | 'horizontal' | 'inline'
  theme?: 'light' | 'dark'
}
function findKeyByPath(menuItems: CommonMenuItem[], path: string): string | undefined {
  for (const item of menuItems) {
    if (item.path === path) {
      return item.key
    }
    if (item.children) {
      const foundKey = findKeyByPath(item.children, path)
      if (foundKey) {
        return foundKey
      }
    }
  }
  return undefined
}
export const CommonMenu: React.FC<CommonMenuProps> = ({
  items,
  mode = 'inline',
  theme = 'light',
}) => {
  const location = useLocation()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])

  useEffect(() => {
    const currentPath = findKeyByPath(items, location.pathname)
    if (currentPath) {
      setSelectedKeys([currentPath])
      const pathParts = currentPath.split('/')
      const pathKeys = pathParts.reduce((acc, part, index) => {
        const path = pathParts.slice(0, index + 1).join('/')
        acc.push(path)
        return acc
      }, [] as string[])
      setOpenKeys(pathKeys)
    }
  }, [location, items])

  const generateMenuItems = (menuItems: CommonMenuItem[]): CommonMenuItem[] => {
    return menuItems.map((item: CommonMenuItem) => ({
      key: item.key,
      icon: item.icon,
      label: item.children ? item.label : <Link to={item.path!}>{item.label}</Link>,
      children: item.children ? generateMenuItems(item.children) : undefined,
    }))
  }

  const menuItems = generateMenuItems(items)

  return (
    <Menu
      items={menuItems}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      mode={mode}
      theme={theme}
      onOpenChange={keys => setOpenKeys(keys)}
      style={{
        height: '100%',
      }}
    />
  )
}
