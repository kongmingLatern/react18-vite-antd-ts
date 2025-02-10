import { SendOutlined } from '@ant-design/icons'
import { http, httpPost } from '@react18-vite-antd-ts/axios'
import { message as AntdMessage, Avatar, Button, Input, Layout, List, theme, Typography } from 'antd'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const { Content } = Layout
const { TextArea } = Input
const { Text } = Typography

interface Message {
  content: string
  isUser: boolean
  canPaste?: boolean
  loading?: boolean
  hasDone?: boolean
  role: 'user' | 'assistant'
}

export default function Deepseek() {
  const { useToken } = theme
  const { token } = useToken()
  console.log('token', token)

  const [messages, setMessages] = useState<Message[]>([{
    content: '你好, 请问有什么可以帮助您的?',
    isUser: false,
    canPaste: false,
    hasDone: true,
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
      hasDone: false,
      role: 'assistant',
      loading: true,
    }])

    // Simulate AI response
    // const res = await httpPost('/deepseek/chat', {
    //   messages: [
    //     ...messages.filter(msg => msg.isUser).map(msg => ({ role: 'user', content: msg.content })),
    //     {
    //       role: 'user',
    //       content: inputValue,
    //     },
    //   ],
    // }, {
    //   headers: {
    //     'x-api-key': import.meta.env.VITE_DEEPSEEK_API_KEY,
    //   },
    // }).finally(() => {
    //   setMessages(prev => prev.slice(0, prev.length - 1))
    // })

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

    console.log('es', es)

    es.addEventListener('message', (event) => {
      if (event.data) {
        const { data } = event
        if (data === '[DONE]') {
          setMessages(prev => prev.filter(msg => !msg.isUser).map(msg => ({ ...msg, canPaste: true, hasDone: true })))
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
              hasDone: false,
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
              hasDone: false,
            }]
          }
        })
      }
      console.log('message', event)
    })

    es.addEventListener('open', (event) => {
      console.log('open', event)
    })

    es.addEventListener('error', (event) => {
      // 删除最后一个loading消息
      setMessages(prev => prev.filter(msg => !msg.loading))
      AntdMessage.error(`请求失败, 异常信息: ${event.error}`)
    })

    // Remove loading message and add AI response
    // if (res) {
    //   setMessages((prev) => {
    //     const newMessages = prev.filter(msg => !msg.loading)
    //     return [...newMessages, {
    //       isUser: false,
    //       role: 'assistant',
    //       content: res.data.content,
    //     }]
    //   })
    // }
  }

  const handleCopy = (content: string, type: 'markdown' | 'text') => {
    const textToCopy = type === 'markdown' ? content : content.replace(/[#*`]/g, '')
    navigator.clipboard.writeText(textToCopy)
    AntdMessage.success(`已复制${type === 'markdown' ? 'Markdown' : '纯文本'}内容到剪贴板`)
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
                  <div className={`p-3 rounded-lg max-w-1/2 relative ${message.isUser ? 'bg-blue-500 ' : 'bg-gray-100'}`}>
                    {message.isUser
                      ? (
                          <ReactMarkdown
                            className="color-white"
                            components={{
                              code: (props) => {
                                const { children, className, node, ...rest } = props
                                const match = /language-(\w+)/.exec(className || '')
                                return match
                                  ? (
                                      <SyntaxHighlighter
                                        {...rest}
                                        PreTag="div"
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                        style={dark}
                                      />
                                    )
                                  : (
                                      <code {...rest} className={className}>
                                        {children}
                                      </code>
                                    )
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )
                      : (
                          <div className="markdown-body" style={{ color: 'black' }}>
                            {message.loading
                              ? (
                                  <span className="animate-pulse">{message.content}</span>
                                )
                              : (
                                  <>
                                    <ReactMarkdown
                                      components={{
                                        code: (props) => {
                                          const { children, className, node, ...rest } = props
                                          const match = /language-(\w+)/.exec(className || '')
                                          return match
                                            ? (
                                                <SyntaxHighlighter
                                                  {...rest}
                                                  PreTag="div"
                                                  children={String(children).replace(/\n$/, '')}
                                                  language={match[1]}
                                                  style={dark}
                                                />
                                              )
                                            : (
                                                <code {...rest} className={className}>
                                                  {children}
                                                </code>
                                              )
                                        },
                                      }}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                    {!message.loading && message.canPaste && (
                                      <div className="absolute bottom-1 right-1 flex gap-1">
                                        <Button size="small" onClick={() => handleCopy(message.content, 'markdown')}>
                                          复制Markdown
                                        </Button>
                                        <Button size="small" onClick={() => handleCopy(message.content, 'text')}>
                                          复制纯文本
                                        </Button>
                                      </div>
                                    )}
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
