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

  // 抽离表单处理逻辑
  const handleFormSubmit = async (action: DefaultActionItemType, values: any) => {
    if (action.formProps?.onBeforeSubmit) {
      values = action.formProps?.onBeforeSubmit(values)
    }
    if (action.formProps?.onFinish) {
      action.formProps?.onFinish(values)
    }
    else {
      await http.post(action.requestUrl, values)
    }
  }

  async function handleOk(action: DefaultActionItemType) {
    if (action.formProps) {
      const isValid = await basicFormRef.current?.validateFields()
      if (isValid) {
        const values = basicFormRef.current?.getFieldsValue()
        await handleFormSubmit(action, values)
      }
      setIsModalOpen(false)
      setTimeout(() => {
        basicFormRef.current?.resetFields()
      }, 100)
    }
  }

  // 抽离内容渲染逻辑
  const renderContent = (action: DefaultActionItemType, isDefaultAction: boolean): React.ReactNode => {
    if (action.formProps) {
      return <BasicForm ref={basicFormRef} footer={false} {...action.formProps} />
    }
    if (action.render) {
      return action.render()
    }
    throw new Error('未定义内容，使用formProps或render均可')
  }

  // 处理不同类型的组件显示
  const handleComponentDisplay = (action: DefaultActionItemType, isDefaultAction: boolean) => {
    const content = renderContent(action, isDefaultAction)

    if (action?.component_type === 'modal') {
      showModal({ onOk: () => handleOk(action), ...action.modalProps, children: content })
    }
    else if (action?.component_type === 'drawer') {
      showDrawer({ onFinish: () => handleOk(action), ...action.drawerProps, content })
    }
  }

  const handleClick = async (action: DefaultActionItemType, isDefaultAction: boolean = true) => {
    setClickAction(action)
    if (action?.onClick) {
      action.onClick()
      return
    }

    if (action.key === 'export') {
      await httpExport(action.requestUrl, action.requestData)
      return
    }

    handleComponentDisplay(action, isDefaultAction)
  }

  // 抽离按钮渲染逻辑
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
    return (
      <Button
        key={action.text + key}
        type="primary"
        onClick={() => handleClick(action, true)}
        {...action.buttonProps}
      >
        {action.text}
      </Button>
    )
  }

  const renderButtons = () => {
    const buttons: React.ReactNode[] = []

    if (defaultActions) {
      Object.entries(defaultActions).forEach(([key, action]) => {
        if (!action.hidden) {
          buttons.push(renderActionButton(key, action))
        }
      })
    }

    if (extraActions) {
      extraActions.forEach((action) => {
        if (!action.hidden) {
          buttons.push(renderActionButton(action.type as string, action))
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
        onOk: () => handleOk(clickAction as DefaultActionItemType),
        onCancel: () => setIsModalOpen(false),
        ...clickAction?.modalProps,
      })}
    </>
  )
}
