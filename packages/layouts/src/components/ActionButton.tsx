import type { ActionButtonItemType, DefaultActionItemType, ToolBarProps } from '@react18-vite-antd-ts/types'
import type { FormInstance, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { http, httpExport } from '@react18-vite-antd-ts/axios'
import { BasicForm } from '@react18-vite-antd-ts/components'
import { useDrawer, useModal } from '@react18-vite-antd-ts/hooks'
import { Button, Space, Upload } from 'antd'
import React, { useRef, useState } from 'react'

interface ActionButtonsProps {
  actionButtonCfg: ToolBarProps['actionButtonCfg']
}

export function ActionButtons(props: ActionButtonsProps) {
  const { showDrawer, DrawerComponent } = useDrawer()
  const { showModal, ModalComponent, setIsModalOpen } = useModal()
  const { actionButtonCfg } = props || {}
  const { defaultActions, extraActions } = actionButtonCfg || {}
  const [clickAction, setClickAction] = useState<ActionButtonItemType | null>(null)
  const basicFormRef = useRef<FormInstance>(null)

  async function handleOk(action: DefaultActionItemType) {
    if (action.formProps) {
      console.log(basicFormRef.current?.getFieldsValue())
      setIsModalOpen(false)
      setTimeout(() => {
        basicFormRef.current?.resetFields()
      }, 100)
    }
  }

  const handleClick = async (action: DefaultActionItemType, isDefaultAction: boolean = true) => {
    setClickAction(action)
    if (action?.onClick) {
      action.onClick()
      return
    }

    // 针对于action做不同的处理
    if (action.key === 'export') {
      // 请求导出
      await httpExport(action.requestUrl, action.requestData)
    }

    if (action?.component_type === 'modal') {
      let modalContent: React.ReactNode = null

      if (isDefaultAction && action.formProps) {
        modalContent = <BasicForm ref={basicFormRef} footer={false} {...action.formProps} />
      }
      else if (action.render) {
        modalContent = action.render()
      }
      else {
        throw new Error('未定义modal内容，使用formProps或render均可')
      }

      showModal({ onOk: () => handleOk(action), ...action.modalProps, children: modalContent })
    }
    else if (action?.component_type === 'drawer') {
      let drawerContent: React.ReactNode = null

      if (isDefaultAction && action.formProps) {
        drawerContent = <BasicForm ref={basicFormRef} footer={false} {...action.formProps} />
      }
      else if (action.render) {
        drawerContent = action.render()
      }
      else {
        throw new Error('未定义drawer内容，使用formProps或render均可')
      }

      showDrawer({ onFinish: () => handleOk(action), ...action.drawerProps, content: drawerContent })
    }
  }

  // 动态生成按钮组件
  const renderButtons = () => {
    const buttons: React.ReactNode[] = []

    const renderActionButton = (key: string, action: DefaultActionItemType) => {
      if (key === 'upload') {
        const defaultUploadProps: UploadProps = {
          name: 'file',
          action: action.requestUrl,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          showUploadList: false,
        }
        return (
          <Upload key={action.text + key} {...defaultUploadProps} {...action.uploadProps}>
            <Button icon={<UploadOutlined />} {...action.buttonProps}>{action.text}</Button>
          </Upload>
        )
      }
      else {
        return (
          <Button key={action.text + key} type="primary" onClick={() => handleClick(action, true)} {...action.buttonProps}>
            {action.text}
          </Button>
        )
      }
    }

    // 默认操作按钮
    if (defaultActions) {
      Object.entries(defaultActions).forEach(([key, action]) => {
        if (!action.hidden) {
          buttons.push(renderActionButton(key, action))
        }
      })
    }

    // 额外操作按钮
    if (extraActions) {
      extraActions.forEach((action) => {
        if (!action.hidden) {
          buttons.push(
            renderActionButton(action.key, action),
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
        onOk: e => handleOk(clickAction, e),
        onCancel: () => setIsModalOpen(false),
        ...clickAction?.modalProps,
      })}
    </>
  )
}
