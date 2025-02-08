import type { ReactNode } from 'react'
import { CloseOutlined, HomeOutlined, InfoCircleOutlined, MenuOutlined, TagsOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { Breadcrumb, theme } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useLocation, useNavigate } from 'react-router-dom'

interface BreadcrumbItem {
  path: string
  label: string
  icon?: ReactNode
}

export const menuMap = {
  '/index': { label: '首页', icon: <HomeOutlined /> },
  '/deepseek': { label: 'Deepseek', icon: <HomeOutlined /> },
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

interface DraggableBreadcrumbItemProps {
  item: BreadcrumbItem
  index: number
  breadcrumbHistory: BreadcrumbItem[]
  moveItem: (dragIndex: number, hoverIndex: number) => void
  currentPath: string
  onNavigate: (path: string) => void
  onClose: (path: string, index: number) => void
}

const DraggableBreadcrumbItem: React.FC<DraggableBreadcrumbItemProps> = ({
  breadcrumbHistory,
  item,
  index,
  moveItem,
  currentPath,
  onNavigate,
  onClose,
}) => {
  const { token } = theme.useToken()
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag({
    type: 'breadcrumb',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: 'breadcrumb',
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
    hover(draggedItem: { index: number }) {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transition: 'all .3s',
        // transition: isDragging ? 'none' : 'all 0.3s ease',
        color: token.colorTextSecondary,
        backgroundColor: currentPath === item.path ? token.colorPrimaryBg : token.colorBgContainer,
      }}
      className={`min-w-90px justify-center h-40px cursor-pointer transition inline-flex items-center px-3 py-1 relative ${
        currentPath === item.path ? 'rounded-tl-md rounded-tr-md' : 'rounded'
      }`}
      onClick={() => onNavigate(item.path)}
    >
      {item.icon && <span className="mr-1rem">{item.icon}</span>}
      <span>{item.label}</span>
      {breadcrumbHistory.length > 1 && (
        <CloseOutlined
          className="ml-2 cursor-pointer text-gray-400 hover:text-purple-500"
          onClick={(e) => {
            e.stopPropagation()
            onClose(item.path, index)
          }}
        />
      )}
      {isOver && (
        <div
          className="absolute h-full w-1 bg-purple-500"
          style={{
            left: '-2px',
            top: 0,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  )
}

const AdminBreadcrumb: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [breadcrumbHistory, setBreadcrumbHistory] = useState<BreadcrumbItem[]>([])
  const { token } = theme.useToken()

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
        const lastItem = newHistory[newHistory.length - 1]
        navigate(lastItem.path)
      }
    }
  }

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const dragItem = breadcrumbHistory[dragIndex]
    setBreadcrumbHistory((prevItems) => {
      const newItems = [...prevItems]
      newItems.splice(dragIndex, 1)
      newItems.splice(hoverIndex, 0, dragItem)
      return newItems
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full" style={{ backgroundColor: token.colorBgContainer }}>
        <Breadcrumb
          className="flex items-end w-full"
          style={{ margin: '0', height: '50px', paddingLeft: '20px' }}
          separator={<span className="text-gray-300 h-full select-none flex items-center">|</span>}
        >
          {breadcrumbHistory.map((item, index) => (
            <Breadcrumb.Item key={item.path}>
              <DraggableBreadcrumbItem
                breadcrumbHistory={breadcrumbHistory}
                item={item}
                index={index}
                moveItem={moveItem}
                currentPath={location.pathname}
                onNavigate={navigate}
                onClose={handleCloseBreadcrumb}
              />
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
    </DndProvider>
  )
}

export default AdminBreadcrumb
