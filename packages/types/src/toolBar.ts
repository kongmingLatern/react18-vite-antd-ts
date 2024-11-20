import type { CommonTableRef } from '@react18-vite-antd-ts/components'
import type { SearchFormProps } from '@react18-vite-antd-ts/layouts'
import type { SearchFormRef } from '@react18-vite-antd-ts/layouts/src/components/SearchForm'

export interface ActionButtonItemType {
  text: string
  hidden?: boolean | (() => boolean)
  onClick: () => void
  render: () => React.ReactNode
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
      add: ActionButtonItemType
      export: ActionButtonItemType
    }
    extraActions: ActionButtonItemType[]
  }
}
