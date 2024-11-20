import type { ReactNode } from 'react'
import { Button, Drawer, Space } from 'antd'
import { useState } from 'react'

interface UseDrawerProps {
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  width?: number
  height?: number
}

interface DrawerState {
  title?: ReactNode
  visible: boolean
  content?: ReactNode | null
  onFinish?: () => Promise<void>
  showFooter?: boolean
}

export function useDrawer({
  placement = 'right',
  width = 450,
  // height = 378,
}: UseDrawerProps = {}) {
  const [drawerState, setDrawerState] = useState<DrawerState>({
    title: '信息',
    visible: false,
    content: null,
    showFooter: true,
  })

  const [loading, setLoading] = useState(false)

  const showDrawer = (options?: Omit<DrawerState, 'visible'>) => {
    setLoading(false)
    setDrawerState(prevState => ({ ...prevState, visible: true, ...options }))
  }

  const closeDrawer = () => {
    setDrawerState(prevState => ({ ...prevState, visible: false }))
  }

  const DrawerComponent = () => {
    async function handleSave() {
      setLoading(true)
      await drawerState.onFinish?.().finally(() => {
        setLoading(false)
      })
      closeDrawer()
    }

    return (
      <Drawer
        title={drawerState.title}
        placement={placement}
        width={placement === 'left' || placement === 'right' ? width : undefined}
        height={placement === 'top' || placement === 'bottom' ? height : undefined}
        onClose={closeDrawer}
        open={drawerState.visible}
        footer={
          drawerState.showFooter
            ? (
                <Space className="justify-end w-full">
                  <Button color="default" variant="outlined" onClick={closeDrawer}>
                    关闭
                  </Button>
                  <Button loading={loading} type="primary" onClick={handleSave}>
                    保存
                  </Button>
                </Space>
              )
            : null
        }
      >
        {drawerState.content}
      </Drawer>
    )
  }

  return {
    showDrawer,
    closeDrawer,
    DrawerComponent,
  }
}
