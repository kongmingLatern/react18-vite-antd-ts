import { Divider, Space } from 'antd'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function CustomOrderedList({ children }: { children: React.ReactNode }) {
  return (
    <ol className="custom-ol" style={{ padding: '0 1rem' }}>
      {children}
    </ol>
  )
}

function CustomUnorderedList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="custom-ul" style={{ padding: '0 1rem' }}>
      {children}
    </ul>
  )
}

function CustomHr() {
  return <Divider style={{ margin: '15px 0' }} />
}

interface HighLightProps extends React.ComponentProps<typeof ReactMarkdown> {
  children: string
}

export function HighLight(props: HighLightProps) {
  const { children, ...rest } = props
  return (
    <ReactMarkdown
      components={{
        ol: CustomOrderedList as any,
        ul: CustomUnorderedList as any,
        hr: CustomHr as any,
        code: (props) => {
          const { children, className, node, ...rest } = props
          const match = /language-(\w+)/.exec(className || '')
          return match
            ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  language={match[1]}
                  style={dark}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              )
            : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
        },
      }}
      {...rest}
    >
      {children}
    </ReactMarkdown>
  )
}
