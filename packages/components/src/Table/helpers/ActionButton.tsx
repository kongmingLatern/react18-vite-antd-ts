import { useDrawer } from "@react18-vite-antd-ts/hooks"
import { Button, FormInstance, message, Popconfirm, Dropdown, Menu } from "antd"
import { BasicForm } from "../../Form/BasicForm"
import { useRef } from "react"
import { ReadonlyForm } from "../../Form/ReadonlyForm"
import { EllipsisOutlined } from '@ant-design/icons'

export interface ActionConfig {
  text: string
  onClick: (record: any) => void
  danger?: boolean
  needConfirm?: boolean
  confirmTitle?: string
  index?: number
}

export function ActionButton(props: {
  actions?: ActionConfig[]
  record: any
  maxVisible?: number
  onView?: (record: any) => void
  onEdit?: (record: any) => void
  onDelete?: (record: any) => void
}) {
  const { actions: customActions = [], record, maxVisible = 3, onView, onEdit, onDelete } = props;
  const formRef = useRef<FormInstance<any> | null>(null);

  const { showDrawer, DrawerComponent } = useDrawer()
  const defaultActions: ActionConfig[] = [
    {
      text: '查看',
      onClick: (record) => {
        if (onView) {
          onView?.(record)
          return
        }
        showDrawer({
          title: '查看',
          showFooter: false,
          content: <ReadonlyForm
            initialValues={record}
            formItems={[{
              name: 'name',
              label: '姓名',
              type: 'input',
              // rules: [{ required: true, message: '请输入姓名' }],
              placeholder: '请输入姓名',
            },
            {
              name: 'username',
              label: '用户名',
              type: 'input',
              // rules: [{ required: true, message: '请选择性别' }],
              placeholder: '请输入用户名',
            },
            {
              name: 'password',
              label: '密码',
              type: 'input',
              placeholder: '请输入密码',
            },
            ]} />,
        })
      },
      index: 0
    },
    {
      text: '编辑',
      onClick: (record) => {
        if (onEdit) {
          onEdit?.(record)
          return
        }
        showDrawer({
          title: '编辑',
          showFooter: true,
          content: <BasicForm
            ref={formRef}
            initialValues={record}
            formItems={[{
              name: 'name',
              label: '姓名',
              type: 'input',
              // rules: [{ required: true, message: '请输入姓名' }],
              placeholder: '请输入姓名',
            },
            {
              name: 'username',
              label: '用户名',
              type: 'input',
              // rules: [{ required: true, message: '请选择性别' }],
              placeholder: '请输入用户名',
            },
            {
              name: 'password',
              label: '密码',
              type: 'input',
              placeholder: '请输入密码',
            },
            ]} />,
          onFinish: async () => {
            const form = formRef.current;

            if (form) {
              const values = await form.validateFields();
              message.success(`保存成功: ${JSON.stringify(values)}`)
              // TODO: 保存数据
              console.log('Form values:', values);

              // 清空
              form.resetFields();
            }
          }
        })
      },
      index: 1
    },
    {
      text: '删除',
      onClick: (record) => {
        if (onDelete) {
          onDelete?.(record)
          return
        }
        message.success(`删除成功: ${JSON.stringify(record)}`)
      },
      danger: true,
      needConfirm: true,
      confirmTitle: '确定要删除吗？',
      index: 2
    }
  ]

  const mergedActions = [...defaultActions, ...customActions]
    .sort((a, b) => (a.index || 0) - (b.index || 0));


  const renderButton = (action: ActionConfig, index: number) => {
    const buttonProps = {
      onClick: () => action.onClick(record),
      type: 'link' as const,
      danger: action.danger,
    };

    if (action.needConfirm) {
      // 剃除buttonProps中的onClick
      const { onClick, ...restButtonProps } = buttonProps;

      return (
        <Popconfirm
          key={index}
          title={action.confirmTitle || `确定要${action.text}吗？`}
          onConfirm={() => action.onClick(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button {...restButtonProps}>{action.text}</Button>
        </Popconfirm>
      );
    }

    return <Button key={index} {...buttonProps}>{action.text}</Button>;
  };

  const visibleActions = mergedActions.slice(0, maxVisible);
  const hiddenActions = mergedActions.slice(maxVisible);

  return (
    <>
      {visibleActions.map(renderButton)}
      {hiddenActions.length > 0 && (
        <Dropdown
          menu={{
            items: hiddenActions.map((action, index) => ({
              key: action.text,
              label: renderButton(action, index),
            })),
          }}
        >
          <Button type="link">
            更多 <EllipsisOutlined />
          </Button>
        </Dropdown>
      )}
      {DrawerComponent()}
    </>
  );
}