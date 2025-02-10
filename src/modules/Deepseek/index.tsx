import { SendOutlined } from '@ant-design/icons'
import { Icon } from '@iconify/react/dist/iconify.js'
import { HighLight } from '@react18-vite-antd-ts/components'
import { message as AntdMessage, Avatar, Button, Input, Layout, List, theme, Tooltip } from 'antd'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useEffect, useRef, useState } from 'react'

const { Content } = Layout
const { TextArea } = Input

interface Message {
  content: string
  isUser: boolean
  canPaste?: boolean
  loading?: boolean
  isBuildIn?: boolean
  role: 'user' | 'assistant'
}

export default function Deepseek() {
  const { useToken } = theme
  const [clickType, setClickType] = useState<'markdown' | 'text' | ''>('')
  const { token } = useToken()

  const [messages, setMessages] = useState<Message[]>([{
    content: `你好, 请问有什么可以帮助您的?`,
    isUser: false,
    canPaste: false,
    isBuildIn: true,
    role: 'assistant',
  }])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim())
      return

    // Add user message
    const userMessage: Message = {
      content: inputValue,
      isUser: true,
      role: 'user',
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

    // sse
    const message = [
      ...messages.filter(msg => msg.isUser).map(msg => ({ role: 'user', content: msg.content })),
      {
        role: 'user',
        content: inputValue,
      },
    ]
    const es = new EventSourcePolyfill(`/api/deepseek/chat/stream?messages=${JSON.stringify(message)}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_DEEPSEEK_API_KEY,
      },
    })

    es.addEventListener('message', (event) => {
      if (event.data) {
        const { data } = event
        if (data === '[DONE]') {
          setMessages((prev) => {
            const lastAssistantIndex = [...prev].reverse().findIndex(msg => !msg.isUser)
            if (lastAssistantIndex === -1)
              return prev
            const actualIndex = prev.length - 1 - lastAssistantIndex
            return prev.map((msg, index) =>
              index === actualIndex ? { ...msg, canPaste: true } : msg,
            )
          })
          es.close()
          return
        }

        const content = JSON.parse(data).choices[0]?.delta?.content
        // 注意,这里要拼接内容,即反复更新最后一个消息
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.loading) {
            // Replace loading message with first chunk
            return [...prev.slice(0, -1), {
              content: content || '',
              isUser: false,
              role: 'assistant',
              loading: false,
              canPaste: false,
            }]
          }
          else {
            // Append content to last message
            return [...prev.slice(0, -1), {
              ...prev[prev.length - 1],
              content: prev[prev.length - 1].content + (content || ''),
              canPaste: false,
            }]
          }
        })
      }
    })

    es.addEventListener('error', (event) => {
      // 删除最后一个loading消息
      setMessages(prev => prev.filter(msg => !msg.loading))
      AntdMessage.error(`请求失败, 异常信息: ${event.error}`)
      es.close()
    })
  }
  const handleCopy = (content: string, type: 'markdown' | 'text') => {
    const textToCopy = type === 'markdown' ? content : content.replace(/[#*`]/g, '')
    navigator.clipboard.writeText(textToCopy)
    AntdMessage.success(`已复制${type === 'markdown' ? 'Markdown' : '纯文本'}内容到剪贴板`)
    setClickType(type)
    // 1.5秒后重置图标
    setTimeout(() => {
      setClickType('')
    }, 1500)
  }

  return (
    <Layout
      className="relative overflow-hidden pt-10px box-border"
      style={{
        backgroundColor: token.colorBgContainer,
        height: 'calc(100vh - 200px)',
      }}
    >
      <Content className="p-4 flex flex-col">
        <div className="flex-1 overflow-auto pb-80px pr-10px">
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
                  <div className={`p-3 rounded-lg max-w-1/2 ${message.isUser ? 'bg-blue-500 ' : 'bg-gray-100'}`}>
                    {message.isUser
                      ? (
                          <HighLight className="color-white">
                            {message.content}
                          </HighLight>

                        )
                      : (
                          <div className="markdown-body" style={{ color: 'black' }}>
                            {message.loading
                              ? (
                                  <span className="animate-pulse">{message.content}</span>
                                )
                              : (
                                  <>
                                    <HighLight>
                                      {message.content}
                                    </HighLight>
                                    {
                                      !message.loading && !message.isBuildIn && message.canPaste && (
                                        <div className="mt-2 flex gap-1 justify-end">
                                          <Tooltip title="复制Markdown">
                                            <Button type="text" ghost icon={<Icon icon={clickType === 'markdown' ? 'material-symbols:check' : 'material-symbols:markdown-paste'} color="#909090" fontSize={20} />} onClick={() => handleCopy(message.content, 'markdown')} />
                                          </Tooltip>

                                          <Tooltip title="复制纯文本">
                                            <Button type="text" ghost icon={<Icon icon={clickType === 'text' ? 'material-symbols:check' : 'material-symbols:content-copy'} color="#909090" fontSize={20} />} onClick={() => handleCopy(message.content, 'text')} />
                                          </Tooltip>
                                        </div>
                                      )
                                    }
                                  </>
                                )}
                          </div>
                        )}
                  </div>
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>

        <div className="border-box absolute bottom-20px left-10px right-20px flex w-full items-center">
          <TextArea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="输入消息..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              maxWidth: 'calc(100% - 150px)',
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
