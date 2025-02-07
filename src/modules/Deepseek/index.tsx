import { SendOutlined } from '@ant-design/icons'
import { http, httpPost } from '@react18-vite-antd-ts/axios'
import { Avatar, Button, Input, Layout, List, Typography } from 'antd'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const { Content } = Layout
const { TextArea } = Input
const { Text } = Typography

interface Message {
  content: string
  isUser: boolean
  loading?: boolean
  role: 'user' | 'assistant'
}

export default function Deepseek() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')

  const handleSend = async () => {
    if (!inputValue.trim())
      return

    // Add user message
    const userMessage: Message = {
      content: inputValue,
      isUser: true,
    }

    setMessages([...messages, userMessage])
    setInputValue('')

    // Add loading message
    setMessages(prev => [...prev, {
      content: '...',
      isUser: false,
      role: 'assistant',
      loading: true,
    }])

    console.log(import.meta.env)

    // Simulate AI response
    const res = await httpPost('/deepseek/chat', {
      messages: [
        ...messages.filter(msg => msg.isUser).map(msg => ({ role: 'user', content: msg.content })),
        {
          role: 'user',
          content: inputValue,
        },
      ],
    }, {
      headers: {
        'x-api-key': import.meta.env.VITE_DEEPSEEK_API_KEY,
      },
    }).finally(() => {
      setMessages(prev => prev.slice(0, prev.length - 1))
    })

    // Remove loading message and add AI response
    if (res) {
      setMessages((prev) => {
        const newMessages = prev.filter(msg => !msg.loading)
        return [...newMessages, {
          isUser: false,
          role: 'assistant',
          content: res.data.content,
        }]
      })
    }
  }

  return (
    <Layout
      className="relative overflow-hidden bg-white pt-10px box-border"
      style={{
        height: 'calc(100vh - 250px)',
      }}
    >
      <Content className="p-4 flex flex-col">
        <div className="flex-1 overflow-auto pb-80px">
          <List
            split={false}
            dataSource={messages}
            renderItem={message => (
              <List.Item className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-center w-full ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar
                    className="mx-2"
                    src={message.isUser ? 'https://avatars.githubusercontent.com/u/88939906?v=4' : 'https://chat.deepseek.com/favicon.svg'}
                  />
                  <div className={`p-3 rounded-lg ${message.isUser ? 'bg-blue-500 ' : 'bg-gray-100'}`}>
                    {message.isUser
                      ? (
                          <Text style={{ color: 'white' }}>
                            {message.content}
                          </Text>
                        )
                      : (
                          <div className="markdown-body" style={{ color: 'black' }}>
                            {message.loading
                              ? (
                                  <span className="animate-pulse">{message.content}</span>
                                )
                              : (
                                  <ReactMarkdown>
                                    {message.content}
                                  </ReactMarkdown>
                                )}
                          </div>
                        )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div className="border-box absolute bottom-20px flex w-full items-center">
          <TextArea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="输入消息..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              maxWidth: 'calc(100% - 140px)',
            }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            className="ml-20px"
            type="primary"
            icon={<SendOutlined />}
            loading={messages[messages.length - 1]?.loading}
            onClick={handleSend}
          >
            发送
          </Button>
        </div>
      </Content>
    </Layout>
  )
}
