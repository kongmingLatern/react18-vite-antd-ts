import { Button, Form, Input, Space } from 'antd'

export function SearchForm() {
  return (
    <Form layout="inline">
      <Form.Item name="username" label="Username">
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item>
        <Space align="center">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button htmlType="reset">重置</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
