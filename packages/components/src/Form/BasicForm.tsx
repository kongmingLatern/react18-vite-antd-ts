import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { FormInstance } from 'antd/es/form';

// 定义表单项类型
export type FormItemType = 'input' | 'select' | 'datePicker';

// 定义表单项配置接口
export interface FormItemConfig {
  name: string;
  label: string;
  type: FormItemType;
  rules?: any[];
  options?: { value: string | number; label: string }[];
  placeholder?: string;
}

// 定义BasicForm组件的props接口
interface BasicFormProps {
  formItems: FormItemConfig[];
  onFinish?: (values: any) => Promise<void>;
  onFinishFailed?: (errorInfo: any) => Promise<void>;
  initialValues?: Record<string, any>;
  form?: FormInstance;
  footer?: React.ReactNode;
}

// BasicForm组件
export const BasicForm = React.forwardRef<FormInstance, BasicFormProps>(({
  formItems,
  onFinish,
  onFinishFailed,
  initialValues,
  form,
  footer
}, ref) => {
  const [formInstance] = Form.useForm(form);
  console.log('initialValues', initialValues);


  React.useImperativeHandle(ref, () => formInstance);

  // 渲染表单项
  const renderFormItem = (item: FormItemConfig) => {
    switch (item.type) {
      case 'input':
        return <Input placeholder={item.placeholder} />;
      case 'select':
        return (
          <Select placeholder={item.placeholder}>
            {item.options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'datePicker':
        return <DatePicker style={{ width: '100%' }} />;
      default:
        return null;
    }
  };

  return (
    <Form
      ref={ref}
      form={formInstance}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
    >
      {formItems.map((item) => (
        <Form.Item
          key={item.name}
          name={item.name}
          label={item.label}
          rules={item.rules}
        >
          {renderFormItem(item)}
        </Form.Item>
      ))}

      {footer ? (
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button onClick={() => formInstance.resetFields()}>重置</Button>
          </Space>
        </Form.Item>
      ) : null}
    </Form>
  );
});

// 使用示例
/*
const App: React.FC = () => {
  const formItems: FormItemConfig[] = [
    {
      name: 'name',
      label: '姓名',
      type: 'input',
      rules: [{ required: true, message: '请输入姓名' }],
      placeholder: '请输入姓名',
    },
    {
      name: 'gender',
      label: '性别',
      type: 'select',
      rules: [{ required: true, message: '请选择性别' }],
      options: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' },
      ],
      placeholder: '请选择性别',
    },
    {
      name: 'birthdate',
      label: '出生日期',
      type: 'datePicker',
      rules: [{ required: true, message: '请选择出生日期' }],
    },
  ];

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return <BasicForm formItems={formItems} onFinish={onFinish} />;
};
*/

