import React, { useRef } from "react";
import { Button, FormInstance, message, Popconfirm, Dropdown, ButtonProps, Space } from "antd";
import { DownOutlined} from '@ant-design/icons';
import { useDrawer } from "@react18-vite-antd-ts/hooks";
import { BasicForm } from "../../Form/BasicForm";
import { ReadonlyForm } from "../../Form/ReadonlyForm";

export interface ActionConfig {
  buttonProps?: ButtonProps;
  text: string;
  onClick?: (record: any) => void;
  danger?: boolean;
  needConfirm?: boolean;
  confirmTitle?: string;
  // 排序，数字越小，按扭越靠前，默认为0
  index?: number;
  render?: (action: ActionConfig, record: any) => React.ReactNode;
}

export interface ActionButtonProps {
  actions?: ActionConfig[];
  record: any;
  maxVisible?: number;
  onView?: (record: any) => void;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  renderButton?: (action: ActionConfig, index: number, record: any) => React.ReactNode;
  renderTextLink?: (action: ActionConfig, index: number, record: any) => React.ReactNode;
}

export function ActionButton({
  actions: customActions = [],
  record,
  maxVisible = 3,
  onView,
  onEdit,
  onDelete,
  renderButton: customRenderButton,
  renderTextLink: customRenderTextLink
}: ActionButtonProps) {
  const formRef = useRef<FormInstance<any> | null>(null);
  const { showDrawer, DrawerComponent } = useDrawer();

  const defaultActions: ActionConfig[] = [
    {
      text: '查看',
      onClick: (record) => {
        if (onView) {
          onView(record);
          return;
        }
        showDrawer({
          title: '查看',
          showFooter: false,
          content: <ReadonlyForm
            initialValues={record}
            formItems={[
              { name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
              { name: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
              { name: 'password', label: '密码', type: 'input', placeholder: '请输入密码' },
              { name: 'address.street', label: 'a long text demo', type: 'input', placeholder: '请输入地址' },
            ]} />,
        });
      },
      index: 1000
    },
    {
      text: '编辑',
      onClick: (record) => {
        if (onEdit) {
          onEdit(record);
          return;
        }
        showDrawer({
          title: '编辑',
          showFooter: true,
          content: <BasicForm
            ref={formRef}
            initialValues={record}
            formItems={[
              { name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
              { name: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
              { name: 'password', label: '密码', type: 'input', placeholder: '请输入密码' },
              { name: 'address.street', label: '地址', type: 'input', placeholder: '请输入地址' },
            ]} />,
          onFinish: async () => {
            const form = formRef.current;
            if (form) {
              const values = await form.validateFields();
              message.success(`保存成功: ${JSON.stringify(values)}`);
              console.log('Form values:', values);
              form.resetFields();
            }
          }
        });
      },
      index: 1001
    },
    {
      text: '删除',
      onClick: (record) => {
        if (onDelete) {
          onDelete(record);
          return;
        }
        message.success(`删除成功: ${JSON.stringify(record)}`);
      },
      danger: true,
      needConfirm: true,
      confirmTitle: '确定要删除吗？',
      index: 1002
    }
  ];

  const mergedActions = [...defaultActions, ...customActions]
    .sort((a, b) => (a.index || 0) - (b.index || 0));

  const renderButton = (action: ActionConfig, index: number) => {
    if (action.render) {
      return action.render(action, record);
    }

    if (customRenderButton) {
      return customRenderButton(action, index, record);
    }

    const buttonProps = {
      onClick: () => action.onClick?.(record),
      type: 'link' as const,
      danger: action.danger,
      ...action.buttonProps
    };

    if (action.needConfirm) {
      const { onClick, ...restButtonProps } = buttonProps;
      return (
        <Popconfirm
          key={index}
          title={action.confirmTitle || `确定要${action.text}吗？`}
          onConfirm={() => action.onClick?.(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button className=' px-8px' {...restButtonProps}>{action.text}</Button>
        </Popconfirm>
      );
    }

    return <Button className=' px-8px' key={index} {...buttonProps}>{action.text}</Button>;
  };

  const renderTextLink = (action: ActionConfig, index: number) => {
    if (action.render) {
      return action.render(action, record);
    }

    if (customRenderTextLink) {
      return customRenderTextLink(action, index, record);
    }

    const linkProps = {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        action.onClick?.(record);
      },
      href: '#',
      className: `text-link text-center w-full`,
      style: {
        color: action.danger ? 'red' : 'blue',
      },
      ...action.buttonProps
    };

    if (action.needConfirm) {
      const { onClick, ...restButtonProps } = linkProps;
      return (
        <Popconfirm
          key={index}
          title={action.confirmTitle || `确定要${action.text}吗？`}
          onConfirm={() => action.onClick?.(record)}
          okText="确定"
          cancelText="取消"
        >
          <a {...restButtonProps}>{action.text}</a>
        </Popconfirm>
      );
    }

    return <a key={index} {...linkProps}>{action.text}</a>;
  };

  const visibleActions = mergedActions.slice(0, maxVisible);
  const hiddenActions = mergedActions.slice(maxVisible);

  return (
    <>
      <Space align="center" size={5}>
        {visibleActions.map(renderButton)}
      </Space>
      {hiddenActions.length > 0 && (
        <Dropdown
          menu={{
            items: hiddenActions.map((action, index) => ({
              key: action.text,
              label: renderTextLink(action, index),
            })),
          }}
        >
          <Button type="link" className='color-orange-400  '>
            <Space align="end" size={0}>
              更多 <DownOutlined  />
            </Space>
          </Button>
        </Dropdown>
      )}
      {DrawerComponent()}
    </>
  );
}