import type { BasicFormProps, CommonTableRef } from '@react18-vite-antd-ts/components'
import type { SearchFormProps } from '@react18-vite-antd-ts/layouts'
import type { SearchFormRef } from '@react18-vite-antd-ts/layouts/src/components/SearchForm'
import type { ButtonProps, DrawerProps, ModalProps, UploadProps } from 'antd'

export interface DefaultActionType {
  component_type?: 'modal' | 'drawer'
  modalProps?: ModalProps
  drawerProps?: DrawerProps
}

export interface ActionButtonItemType extends DefaultActionType {
  key: string
  text: string
  hidden?: boolean | (() => boolean)
  onClick?: () => void
  render?: () => React.ReactNode
}

export interface DefaultActionItemType extends ActionButtonItemType {
  formProps?: BasicFormProps
  requestUrl: string
  requestData?: Record<string, any>
  uploadProps?: UploadProps
  buttonProps?: ButtonProps
}
export interface ActionItemType extends DefaultActionItemType {
  type?: 'export' | 'upload' | string
}

export interface ToolBarProps {

  searchFormCfg?: {

    /**
     * 搜索回调
     */
    onSearch?: (searchFormValues: Record<string, any>) => void

    /**
     * 搜索前处理参数
     */
    onBeforeSearch?: (searchFormValues: Record<string, any>) => Record<string, any>

    /**
     * 搜索完成后回调
     */
    onAfterSearch?: (res: Record<string, any>) => Promise<any>

    /**
     * onReset
     */
    onReset?: (searchFormValues: Record<string, any>, {
      tableRef,
      searchFormRef,
    }: {
      tableRef: CommonTableRef | null
      searchFormRef: SearchFormRef | null
    }) => void
    /**
     * 搜索表单配置
     */
    searchFormProps?: Partial<SearchFormProps>
  }

  actionButtonCfg?: {
    defaultActions: {
      add?: DefaultActionItemType
      export?: Omit<DefaultActionItemType, 'formProps'>
      upload?: Omit<DefaultActionItemType, 'formProps'>
    }
    extraActions: ActionItemType[]
  }
}
