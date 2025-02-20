
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface MessageListProps {
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, scrollRef }) => {
  return (
    <ScrollArea ref={scrollRef} className="flex-1 pr-4">
      <div className="space-y-6 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // 自定义表格样式
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200" {...props} />
                      </div>
                    ),
                    // 自定义链接样式
                    a: ({node, ...props}) => (
                      <a className="text-blue-500 hover:underline" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.timestamp && (
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {message.timestamp}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
