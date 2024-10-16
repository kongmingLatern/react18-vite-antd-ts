import { SearchForm } from './components/SearchForm'
import { ActionButtons } from './components/ActionButton'
import { CommonTable, type CommonTableProps } from '@react18-vite-antd-ts/components'

interface AdminContentLayoutProps {
	dataCfg: CommonTableProps['dataCfg']
}

export function AdminContentLayout(props: AdminContentLayoutProps) {
	const { dataCfg } = props

	return (
		<>
			<SearchForm />
			<ActionButtons/>
			<CommonTable dataCfg={dataCfg} />
		</>
	)
}
