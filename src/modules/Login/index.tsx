import { LockOutlined, UserOutlined } from '@ant-design/icons'
/**
 * 这里是一段对该页面的描述
 *
 * @author 风之兮原
 * @description 登录
 */
import { Button, Card, Form, Input, message } from 'antd'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState('')

  // 生成随机验证码
  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    setCaptcha(result)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  // 使用防抖处理登录请求
  const handleLogin = useCallback(
    debounce(async (values) => {
      try {
        setLoading(true)
        if (values.captcha.toLowerCase() !== captcha.toLowerCase()) {
          message.error('验证码错误')
          generateCaptcha()
          form.setFieldValue('captcha', '')
          return
        }

        // 这里添加实际的登录逻辑
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟请求
        message.success('登录成功')
        navigate('/index')
      }
      catch (error) {
        message.error(`登录失败: ${error instanceof Error ? error.message : '未知错误'}`)
      }
      finally {
        setLoading(false)
      }
    }, 300),
    [captcha, navigate, form],
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card title="系统登录" style={{ width: 400 }}>
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div className="flex gap-2">
              <Input
                placeholder="验证码"
                size="large"
              />
              <div
                className="w-24 h-10 flex items-center justify-center bg-gray-200 cursor-pointer select-none"
                onClick={generateCaptcha}
              >
                {captcha}
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
