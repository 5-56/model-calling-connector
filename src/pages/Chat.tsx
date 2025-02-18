
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Bot, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import useModels from '../hooks/useModels';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const Chat = () => {
  const { toast } = useToast();
  const { models, getModel } = useModels();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // 模拟历史记录数据
  const [chatHistory] = React.useState<ChatHistory[]>([
    {
      id: '1',
      title: '关于人工智能的讨论',
      date: '2024-02-20',
      messages: [
        { role: 'user', content: '什么是人工智能？' },
        { role: 'assistant', content: '人工智能是计算机科学的一个分支，致力于创造能够模拟人类智能的系统。' },
      ]
    },
    {
      id: '2',
      title: '机器学习基础概念',
      date: '2024-02-19',
      messages: [
        { role: 'user', content: '请解释什么是机器学习？' },
        { role: 'assistant', content: '机器学习是人工智能的一个子领域，它使计算机系统能够通过经验自动改进。' },
      ]
    },
    {
      id: '3',
      title: '深度学习应用案例',
      date: '2024-02-18',
      messages: [
        { role: 'user', content: '深度学习有哪些实际应用？' },
        { role: 'assistant', content: '深度学习在图像识别、自然语言处理、语音识别等领域都有广泛应用。' },
      ]
    },
  ]);

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!selectedModel) {
      toast({
        title: "请选择模型",
        description: "发送消息前请先选择一个AI模型",
        variant: "destructive",
      });
      return;
    }

    const model = getModel(selectedModel);
    if (!model) {
      toast({
        title: "模型配置错误",
        description: "未找到选中的模型配置信息",
        variant: "destructive",
      });
      return;
    }
    
    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(model.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`,
        },
        body: JSON.stringify({
          model: model.name, // 添加model字段
          messages: [
            // 系统提示
            { role: 'system', content: '你是一个有帮助的AI助手。' },
            // 历史消息，用于保持上下文
            ...messages,
            // 新消息
            newMessage
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API请求失败');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        throw new Error('无效的API响应');
      }
    } catch (error) {
      console.error('错误:', error);
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "无法从AI模型获取响应",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (history: ChatHistory) => {
    setMessages(history.messages);
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
                      onClick={() => handleHistoryClick(chat)}
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
            <div className="flex items-center gap-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="选择AI模型" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CardTitle className="text-2xl font-light">聊天界面</CardTitle>
            </div>
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
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading}
              >
                {isLoading ? "发送中..." : "发送"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
