import type { ModalProps } from 'antd'
import { Modal } from 'antd'
import React, { useState } from 'react'

interface UseModalReturnType {
  showModal: (props: ModalProps) => void
  ModalComponent: (props: ModalProps) => JSX.Element
  setIsModalOpen: (isOpen: boolean) => void
  isModalOpen: boolean
}

export function useModal(): UseModalReturnType {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalProps, setModalProps] = useState<ModalProps>({})
  const [children, setChildren] = useState<React.ReactNode>(null)

  const showModal = (props: ModalProps) => {
    setChildren(props.children)
    setModalProps(props)
    setIsModalOpen(true)
  }

  const handleOk = (props: ModalProps, e: React.MouseEvent<HTMLButtonElement>) => {
    const { onOk } = props
    if (onOk) {
      onOk(e)
    }
    // setIsModalOpen(false)
  }

  const ModalComponent = (props: ModalProps) => {
    return (
      <Modal
        {...modalProps}
        {...props}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={e => handleOk(props, e)}
      >
        {children}
      </Modal>
    )
  }

  return {
    showModal,
    ModalComponent,
    setIsModalOpen,
    isModalOpen,
  }
}
