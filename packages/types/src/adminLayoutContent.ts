import type { CommonTableProps } from '@react18-vite-antd-ts/components'
import type { SearchFormRef } from '@react18-vite-antd-ts/layouts/src/components/SearchForm'
import type { ToolBarProps } from './toolBar'

export interface AdminContentLayoutProps extends React.PropsWithChildren {
  toolCfg?: ToolBarProps
  dataCfg?: CommonTableProps['dataCfg']
}

export interface AdminContentLayoutRef {
  getSearchFormRef: () => SearchFormRef
}
