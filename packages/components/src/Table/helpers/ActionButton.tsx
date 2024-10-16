import { useDrawer } from "@react18-vite-antd-ts/hooks"
import { Button, FormInstance, message, Popconfirm } from "antd"
import { BasicForm } from "../../Form/BasicForm"
import { useRef } from "react"
import { ReadonlyForm } from "../../Form/ReadonlyForm"

export function ActionButton(props: {
  actions?: ('view' | 'edit' | 'delete')[]
  record: any
  onView?: (record: any) => void
  onEdit?: (record: any) => void
  onDelete?: (record: any) => void
  customActions?: {
    text: string
    onClick: (record: any) => void
  }[]
}) {
  const { actions = ['view', 'edit', 'delete'], record } = props;
  const formRef = useRef<FormInstance<any> | null>(null);

  const { showDrawer, DrawerComponent } = useDrawer()

  function handleView(record: Record<string, any>) {
    console.log(record);
    if (props.onView) {
      props.onView(record)
      return
    }

    showDrawer({
      title: '查看',
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
  }

  function handleEdit(record: Record<string, any>) {
    if (props.onEdit) {
      props.onEdit(record)
      return
    }
    showDrawer({
      title: '编辑',
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
          console.log('Form values:', values);
        }
      }
    })
  }

  function handleDelete(record: Record<string, any>) {
    console.log(record);
  }

  return (
    <>
      {actions.includes('view') && (
        <Button color='default' variant="link" style={{ color: 'green' }} onClick={() => handleView(record)}>
          查看
        </Button>
      )}
      {actions.includes('edit') && (
        <Button color="primary" variant="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
      )}
      {actions.includes('delete') && (
        <Popconfirm
          title={`确定要删除吗？`}
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button type='link' danger>
            删除
          </Button>
        </Popconfirm>
      )}
      {props.customActions?.map((action, index) => (
        <Button key={index} type="link" onClick={() => action.onClick(record)}>
          {action.text}
        </Button>
      ))}
      {DrawerComponent()}

    </>
  );

}