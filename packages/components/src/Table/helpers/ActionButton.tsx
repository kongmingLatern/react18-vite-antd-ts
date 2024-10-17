import React, { useRef } from 'react'
import {
	Button,
	FormInstance,
	message,
	Popconfirm,
	Dropdown,
	Space,
	MenuProps,
} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useDrawer } from '@react18-vite-antd-ts/hooks'
import { BasicForm } from '../../Form/BasicForm'
import { ReadonlyForm } from '../../Form/ReadonlyForm'
import { MenuItemType } from 'antd/es/menu/interface'
import { ActionButtonDefaultConfig, ActionButtonProps, BaseActionConfig, DefaultActionConfig, DefaultActionType } from '../types/action'

// 默认操作配置
const defaultActionConfig: ActionButtonDefaultConfig = {
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
}

// 渲染操作按钮或链接
const renderAction = (
	action: BaseActionConfig,
	record: any,
	index: number,
	isTextLink: boolean,
	customRender?: (action: BaseActionConfig, record: Record<string, any>, index: number) => React.ReactNode
) => {
	if (action.render) {
		return action.render(action, record)
	}

	if (customRender) {
		return customRender(action, record, index)
	}

  const commonProps = action.needConfirm ? {
		...action.buttonProps,
	} : {
		onClick: (e: React.MouseEvent) => {
			e.preventDefault()
			action.onClick?.(record)
		},
		...action.buttonProps,
	}

	const actionText = typeof action.text === 'function' ? action.text(record, index) : action.text

	const content = (
		isTextLink ? (
			<span
				key={index}
				className={`text-link text-center w-full`}
				style={{
          color: action.danger ? '#ff4d4f' : '#1890ff'
        }}
				{...commonProps}
			>
				{actionText}
			</span>
		) : (
			<Button
				key={index}
				className="px-8px"
				type="link"
				danger={action.danger}
				{...commonProps}
			>
				{actionText}
			</Button>
		)
	)

	if (action.needConfirm) {
		return (
			<Popconfirm
				key={index}
				title={action.confirmTitle || `确定要${actionText}吗？`}
				onConfirm={() => action.onClick?.(record)}
				okText="确定"
				cancelText="取消"
			>
				{content}
			</Popconfirm>
		)
	}

	return content
}

export function ActionButton({
	actions: customActions = [],
	record,
	index,
	maxVisible = 3,
	onView,
	onEdit,
	onDelete,
	renderButton: customRenderButton,
	renderTextLink: customRenderTextLink,
	defaultActionCfg = defaultActionConfig,
}: ActionButtonProps) {
	const formRef = useRef<FormInstance<any> | null>(null)
	const { showDrawer, DrawerComponent } = useDrawer()

	// 合并默认配置和自定义配置
	const actionCfg = {
		hiddenBtn: defaultActionCfg.hiddenBtn,
		viewCfg: { ...defaultActionConfig.viewCfg, ...defaultActionCfg.viewCfg },
		editCfg: { ...defaultActionConfig.editCfg, ...defaultActionCfg.editCfg },
		deleteCfg: { ...defaultActionConfig.deleteCfg, ...defaultActionCfg.deleteCfg },
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
								{ name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
								{ name: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
								{ name: 'password', label: '密码', type: 'input', placeholder: '请输入密码' },
								{ name: 'address.street', label: 'a long text demo', type: 'input', placeholder: '请输入地址' },
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
								{ name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
								{ name: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
								{ name: 'password', label: '密码', type: 'input', placeholder: '请输入密码' },
								{ name: 'address.street', label: '地址', type: 'input', placeholder: '请输入地址' },
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
			if (actionCfg.hiddenBtn?.includes(action.key as DefaultActionConfig['key'] as DefaultActionType)) {
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

	// 计算实际的maxVisible值
	const actualMaxVisible = typeof maxVisible === 'function' ? maxVisible(record, index) : maxVisible

	// 分割可见和隐藏的操作
	const visibleActions = mergedActions.slice(0, actualMaxVisible)
	const hiddenActions = mergedActions.slice(actualMaxVisible)

	// 构建下拉菜单项
	const dropdownItems: MenuProps['items'] = hiddenActions.map(
		(action, index) => ({
			key: action.key,
			label: renderAction(action, record, index, true, customRenderTextLink),
		} as MenuItemType)
	)

	return (
		<>
			<Space align="center" size={5}>
				{visibleActions.map((action, index) => renderAction(action, record, index, false, customRenderButton))}
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
