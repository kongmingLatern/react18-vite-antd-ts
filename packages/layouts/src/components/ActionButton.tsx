import type { ActionButtonItemType, DefaultActionType, ToolBarProps } from '@react18-vite-antd-ts/types'
import { useDrawer, useModal } from '@react18-vite-antd-ts/hooks'
import { Button, Space } from 'antd'
import { useState } from 'react'

interface ActionButtonsProps {
  actionButtonCfg: ToolBarProps['actionButtonCfg']
}

export function ActionButtons(props: ActionButtonsProps) {
  const { showDrawer, DrawerComponent } = useDrawer()
  const { showModal, ModalComponent, setIsModalOpen } = useModal()
  const { actionButtonCfg } = props || {}
  const { defaultActions, extraActions } = actionButtonCfg || {}
  const [clickAction, setClickAction] = useState<ActionButtonItemType & DefaultActionType | null>(null)

  const handleClick = (key: string, isDefaultAction: boolean = true) => {
    const action = isDefaultAction ? defaultActions?.[key as keyof typeof defaultActions] : extraActions?.find(action => action.key === key)
    setClickAction(action)
    if (action?.onClick) {
      action.onClick()
      return
    }
    if ((action as ActionButtonItemType & DefaultActionType)?.component_type === 'modal') {
      showModal({ ...(action as ActionButtonItemType & DefaultActionType).modalProps, children: action?.render() })
    }
    else if ((action as ActionButtonItemType & DefaultActionType)?.component_type === 'drawer') {
      showDrawer({ ...(action as ActionButtonItemType & DefaultActionType).drawerProps, content: action?.render() })
    }
  }

  // 动态生成按钮组件
  const renderButtons = () => {
    const buttons: React.ReactNode[] = []

    // 默认操作按钮
    if (defaultActions) {
      Object.keys(defaultActions).forEach((key) => {
        const action = defaultActions[key as keyof typeof defaultActions]
        if (!action.hidden) {
          buttons.push(
            <Button key={key} type="primary" onClick={() => handleClick(key, true)}>
              {action.text}
            </Button>,
          )
        }
      })
    }

    // 额外操作按钮
    if (extraActions) {
      extraActions.forEach((action) => {
        if (!action.hidden) {
          buttons.push(
            <Button key={action.key} onClick={() => handleClick(action.key, false)}>
              {action.text}
            </Button>,
          )
        }
      })
    }

    return buttons
  }

  return (
    <>
      <Space className="flex justify-end w-full mb-15px">
        {renderButtons()}
      </Space>
      {DrawerComponent()}
      {ModalComponent({
        title: clickAction?.modalProps?.title || clickAction?.text,
        children: clickAction?.render(),
        onOk: () => setIsModalOpen(false),
        onCancel: () => setIsModalOpen(false),
        ...clickAction?.modalProps,
      })}
    </>
  )
}
