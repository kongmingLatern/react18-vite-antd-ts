import { useDrawer } from "@react18-vite-antd-ts/hooks"
import { Button } from "antd"

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

  const { showDrawer, DrawerComponent } = useDrawer()

  function handleView(record: any) {
    console.log(record);
    
    showDrawer({
      title: '查看',
      content: <div>查看</div>
    })
  }

  function handleEdit(record) {
    showDrawer({
      title: '编辑',
      content: <div>编辑</div>
    })
  }

  function handleDelete(record) {

  }

  return (
    <>
      {actions.includes('view') && (
        <Button color="primary" variant="link" onClick={handleView}>
          查看
        </Button>
      )}
      {actions.includes('edit') && (
        <Button color="primary" variant="link" onClick={handleEdit}>
          修改
        </Button>
      )}
      {actions.includes('delete') && (
        <Button type='link' danger onClick={handleDelete}>
          删除
        </Button>
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