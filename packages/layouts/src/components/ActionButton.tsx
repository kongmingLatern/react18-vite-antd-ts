import type { ActionButtonItemType, DefaultActionItemType, DefaultActionType, ToolBarProps } from '@react18-vite-antd-ts/types'
import { BasicForm } from '@react18-vite-antd-ts/components'
import { useDrawer, useModal } from '@react18-vite-antd-ts/hooks'
import { Button, Space } from 'antd'
import React, { useState } from 'react'

interface ActionButtonsProps {
  actionButtonCfg: ToolBarProps['actionButtonCfg']
}

export function ActionButtons(props: ActionButtonsProps) {
  const { showDrawer, DrawerComponent } = useDrawer()
  const { showModal, ModalComponent, setIsModalOpen } = useModal()
  const { actionButtonCfg } = props || {}
  const { defaultActions, extraActions } = actionButtonCfg || {}
  const [clickAction, setClickAction] = useState<ActionButtonItemType | null>(null)

  const handleClick = (key: string, isDefaultAction: boolean = true) => {
    const action = isDefaultAction ? defaultActions?.[key as keyof typeof defaultActions] : extraActions?.find(action => action.key === key) as ActionButtonItemType
    if (action) {
      setClickAction(action!)
      if (action?.onClick) {
        action.onClick()
        return
      }
      if (action?.component_type === 'modal') {
        let modalContent: React.ReactNode = null

        if (isDefaultAction && (action as DefaultActionItemType).formProps) {
          modalContent = <BasicForm footer={false} colProps={{ span: 24 }} {...(action as DefaultActionItemType).formProps} />
        }
        else if (action.render) {
          modalContent = action.render()
        }
        else {
          throw new Error('未定义modal内容，使用formProps或render均可')
        }
        console.log(modalContent)

        showModal({ ...action?.modalProps, children: modalContent })
      }
      else if (action?.component_type === 'drawer') {
        // const drawerContent = action.render?.()
        let drawerContent: React.ReactNode = null

        if (isDefaultAction && (action as DefaultActionItemType).formProps) {
          drawerContent = <BasicForm footer={false} colProps={{ span: 24 }} {...(action as DefaultActionItemType).formProps} />
        }
        else if (action.render) {
          drawerContent = action.render()
        }
        else {
          throw new Error('未定义drawer内容，使用formProps或render均可')
        }

        showDrawer({ ...action?.drawerProps, content: drawerContent })
      }
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
        children: clickAction?.render?.(),
        onOk: () => setIsModalOpen(false),
        onCancel: () => setIsModalOpen(false),
        ...clickAction?.modalProps,
      })}
    </>
  )
}
