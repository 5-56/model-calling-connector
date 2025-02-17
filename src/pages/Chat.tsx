
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, History, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
}

const Chat = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // 模拟历史记录数据
  const [chatHistory] = React.useState<ChatHistory[]>([
    { id: '1', title: '关于人工智能的讨论', date: '2024-02-20' },
    { id: '2', title: '机器学习基础概念', date: '2024-02-19' },
    { id: '3', title: '深度学习应用案例', date: '2024-02-18' },
  ]);

  const handleNewChat = () => {
    setMessages([]);
    // 这里可以添加创建新对话的逻辑
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // 模拟AI响应
    setTimeout(() => {
      const response: Message = {
        role: 'assistant',
        content: "这是一个模拟的响应。连接到您的AI模型以获取真实响应。"
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex gap-6">
        {/* 侧边栏 */}
        <div 
          className={`${
            isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
          } transition-all duration-300 ease-in-out`}
        >
          <Card className="h-[calc(100vh-8rem)]">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-xl font-light">对话历史</CardTitle>
              <Button 
                onClick={handleNewChat}
                variant="ghost" 
                size="icon"
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-2">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="font-medium text-sm">{chat.title}</div>
                      <div className="text-xs text-gray-500">{chat.date}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 主聊天区域 */}
        <Card className="flex-1 h-[calc(100vh-8rem)] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
            <CardTitle className="text-2xl font-light">聊天界面</CardTitle>
            <div className="w-9" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea ref={scrollRef} className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您的消息..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>发送</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
