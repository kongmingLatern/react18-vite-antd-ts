import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker } from 'antd';
import { FormInstance } from 'antd/es/form';
import { FormItemConfig } from './BasicForm';

interface ReadonlyFormProps {
  formItems: ReadonlyFormItemConfig[];
  initialValues?: Record<string, any>;
  form?: FormInstance;
}

interface ReadonlyFormItemConfig extends FormItemConfig {
  loadOptions?: () => Promise<any[]>;
}

export const ReadonlyForm: React.FC<ReadonlyFormProps> = ({
  formItems,
  initialValues,
  form,
}) => {
  const [formInstance] = Form.useForm(form);
  const [asyncOptions, setAsyncOptions] = useState<Record<string, any[]>>({});

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  useEffect(() => {
    // Load async options for select fields
    const loadAsyncOptions = async () => {
      const asyncSelectItems = formItems.filter(
        (item) => item.type === 'select' && item.loadOptions
      );

      for (const item of asyncSelectItems) {
        if (item.loadOptions) {
          const options = await item.loadOptions();
          setAsyncOptions((prev) => ({ ...prev, [item.name]: options }));
        }
      }
    };

    loadAsyncOptions();
  }, [formItems]);

  const renderReadonlyItem = (item: ReadonlyFormItemConfig) => {
    const value = initialValues?.[item.name];

    switch (item.type) {
      case 'input':
        return <Input value={value} readOnly bordered={false} />;
      case 'select':
        const options = item.loadOptions ? asyncOptions[item.name] : item.options;
        const selectedOption = options?.find((option) => option.value === value);
        return (
          <Input
            value={selectedOption?.label || value}
            readOnly
          />
        );
      case 'datePicker':
        return (
          <DatePicker
            value={value ? new Date(value) : undefined}
            format="YYYY-MM-DD"
            disabled
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form
      form={formInstance}
      initialValues={initialValues}
      labelWrap
      {...layout}
    >
      {formItems.map((item) => (
        <Form.Item
          key={item.name}
          name={item.name.split('.')}
          label={<span className='font-semibold'>{item.label}</span>}
        >
          {renderReadonlyItem(item)}
        </Form.Item>
      ))}
    </Form>
  );
};
