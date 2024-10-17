import React, { useRef } from 'react'
import {
	Button,
	FormInstance,
	message,
	Popconfirm,
	Dropdown,
	ButtonProps,
	Space,
	MenuProps,
} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useDrawer } from '@react18-vite-antd-ts/hooks'
import { BasicForm } from '../../Form/BasicForm'
import { ReadonlyForm } from '../../Form/ReadonlyForm'
import { MenuItemType } from 'antd/es/menu/interface'

// 定义基础操作配置接口
export interface BaseActionConfig {
	key?: string
	text?: string
	buttonProps?: ButtonProps
	onClick?: (record: any) => void
	danger?: boolean
	needConfirm?: boolean
	confirmTitle?: string
	index?: number
	render?: (action: BaseActionConfig, record: any) => React.ReactNode
	hidden?: ((record: any) => boolean) | boolean
}

// 定义默认操作类型
export type DefaultActionType = 'view' | 'edit' | 'delete'

// 定义默认操作配置接口
export interface DefaultActionConfig extends BaseActionConfig {
	key?: DefaultActionType
}

// 定义操作按钮属性接口
export interface ActionButtonProps {
	actions?: BaseActionConfig[]
	record: any
	maxVisible?: number
	onView?: (record: any) => void
	onEdit?: (record: any) => void
	onDelete?: (record: any) => void
	renderButton?: (
		action: BaseActionConfig,
		index: number,
		record: any
	) => React.ReactNode
	renderTextLink?: (
		action: BaseActionConfig,
		index: number,
		record: any
	) => React.ReactNode
	defaultActionCfg?: Partial<{
		hiddenBtn?: DefaultActionType[]
		viewCfg: DefaultActionConfig
		editCfg: DefaultActionConfig
		deleteCfg: DefaultActionConfig
	}>
}

export function ActionButton({
	actions: customActions = [],
	record,
	maxVisible = 3,
	onView,
	onEdit,
	onDelete,
	renderButton: customRenderButton,
	renderTextLink: customRenderTextLink,
	defaultActionCfg = {
		hiddenBtn: [],
		viewCfg: { key: 'view', text: '查看', index: 1000 },
		editCfg: { key: 'edit', text: '编辑', index: 1001 },
		deleteCfg: {
			key: 'delete',
			text: '删除',
			index: 1002,
			danger: true,
			needConfirm: true,
			confirmTitle: '确定要删除吗？',
		},
	},
}: ActionButtonProps) {
	const formRef = useRef<FormInstance<any> | null>(null)
	const { showDrawer, DrawerComponent } = useDrawer()

	// 合并默认配置和自定义配置
	const actionCfg = {
		hiddenBtn: defaultActionCfg.hiddenBtn,
		viewCfg: { key: 'view', text: '查看', ...defaultActionCfg.viewCfg },
		editCfg: { key: 'edit', text: '编辑', ...defaultActionCfg.editCfg },
		deleteCfg: {
			key: 'delete',
			text: '删除',
			danger: true,
			needConfirm: true,
			confirmTitle: '确定要删除吗？',
			...defaultActionCfg.deleteCfg,
		},
	}

	// 定义默认操作
	const defaultActions: BaseActionConfig[] = [
		{
			...actionCfg.viewCfg,
			onClick: (record: any) => {
				if (onView) {
					onView(record)
					return
				}
				showDrawer({
					title: '查看',
					showFooter: false,
					content: (
						<ReadonlyForm
							initialValues={record}
							formItems={[
								{
									name: 'name',
									label: '姓名',
									type: 'input',
									placeholder: '请输入姓名',
								},
								{
									name: 'username',
									label: '用户名',
									type: 'input',
									placeholder: '请输入用户名',
								},
								{
									name: 'password',
									label: '密码',
									type: 'input',
									placeholder: '请输入密码',
								},
								{
									name: 'address.street',
									label: 'a long text demo',
									type: 'input',
									placeholder: '请输入地址',
								},
							]}
						/>
					),
				})
			},
		},
		{
			...actionCfg.editCfg,
			onClick: (record: any) => {
				if (onEdit) {
					onEdit(record)
					return
				}
				showDrawer({
					title: '编辑',
					showFooter: true,
					content: (
						<BasicForm
							ref={formRef}
							initialValues={record}
							formItems={[
								{
									name: 'name',
									label: '姓名',
									type: 'input',
									placeholder: '请输入姓名',
								},
								{
									name: 'username',
									label: '用户名',
									type: 'input',
									placeholder: '请输入用户名',
								},
								{
									name: 'password',
									label: '密码',
									type: 'input',
									placeholder: '请输入密码',
								},
								{
									name: 'address.street',
									label: '地址',
									type: 'input',
									placeholder: '请输入地址',
								},
							]}
						/>
					),
					onFinish: async () => {
						const form = formRef.current
						if (form) {
							const values = await form.validateFields()
							message.success(`保存成功: ${JSON.stringify(values)}`)
							console.log('Form values:', values)
							form.resetFields()
						}
					},
				})
			},
		},
		{
			...actionCfg.deleteCfg,
			onClick: (record: any) => {
				if (onDelete) {
					onDelete(record)
					return
				}
				message.success(`删除成功: ${JSON.stringify(record)}`)
			},
		},
	]

	// 过滤并合并操作
	const mergedActions = [...defaultActions, ...customActions]
		.filter(action => {
			// 如果在hiddenBtn中，则不显示
			if (actionCfg.hiddenBtn?.includes(action.key as DefaultActionType)) {
				return false
			}

			// 检查是否明确隐藏
			if (typeof action.hidden === 'boolean') {
				return !action.hidden
			}

			// 如果hidden是函数，则执行它
			if (typeof action.hidden === 'function') {
				return !action.hidden(record)
			}

			return true
		})
		.sort((a, b) => (a.index || 0) - (b.index || 0))

	// 渲染按钮
	const renderButton = (action: BaseActionConfig, index: number) => {
		console.log('action', action)

		if (action.render) {
			return action.render(action, record)
		}

		if (customRenderButton) {
			return customRenderButton(action, index, record)
		}

		const buttonProps = {
			onClick: () => action.onClick?.(record),
			type: 'link' as const,
			danger: action.danger,
			...action.buttonProps,
		}

		if (action.needConfirm) {
			return (
				<Popconfirm
					key={index}
					title={action.confirmTitle || `确定要${action.text}吗？`}
					onConfirm={() => action.onClick?.(record)}
					okText="确定"
					cancelText="取消"
				>
					<Button className="px-8px" {...buttonProps}>
						{action.text}
					</Button>
				</Popconfirm>
			)
		}

		return (
			<Button className="px-8px" key={index} {...buttonProps}>
				{action.text}
			</Button>
		)
	}

	// 渲染文本链接
	const renderTextLink = (action: BaseActionConfig, index: number) => {
		if (action.render) {
			return action.render(action, record)
		}

		if (customRenderTextLink) {
			return customRenderTextLink(action, index, record)
		}

		if (!action.text) {
			console.warn('按扭的text不能为空', action)
			return null
		}

		const linkProps = {
			onClick: (e: React.MouseEvent) => {
				e.preventDefault()
				action.onClick?.(record)
			},
			href: '#',
			className: `text-link text-center w-full`,
			style: {
				color: action.danger ? 'red' : 'blue',
			},
			...action.buttonProps,
		}

		if (action.needConfirm) {
			return (
				<Popconfirm
					key={index}
					title={action.confirmTitle || `确定要${action.text}吗？`}
					onConfirm={() => action.onClick?.(record)}
					okText="确定"
					cancelText="取消"
				>
					<a {...linkProps}>{action.text}</a>
				</Popconfirm>
			)
		}

		return (
			<a key={index} {...linkProps}>
				{action.text}
			</a>
		)
	}

	// 分割可见和隐藏的操作
	const visibleActions = mergedActions.slice(0, maxVisible)
	const hiddenActions = mergedActions.slice(maxVisible)

	// 构建下拉菜单项
	const dropdownItems: MenuProps['items'] = hiddenActions.map(
		(action, index) => ({
			key: action.key,
			label: renderTextLink(action, index),
		} as MenuItemType)
	)

	return (
		<>
			<Space align="center" size={5}>
				{visibleActions.map(renderButton)}
			</Space>
			{hiddenActions.length > 0 && (
				<Dropdown menu={{ items: dropdownItems }}>
					<Button type="link" className="color-orange-400">
						<Space align="end" size={0}>
							更多 <DownOutlined />
						</Space>
					</Button>
				</Dropdown>
			)}
			{DrawerComponent()}
		</>
	)
}
