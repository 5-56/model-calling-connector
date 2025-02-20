
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import useModels from '../hooks/useModels';
import ChatSidebar, { ChatHistory } from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const { toast } = useToast();
  const { models, getModel } = useModels();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedHistory, setSelectedHistory] = React.useState<string | null>(null);
  const [longPressTimeout, setLongPressTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([
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

  const handleLongPressStart = (id: string) => {
    const timeout = setTimeout(() => {
      setSelectedHistory(id);
    }, 500);
    setLongPressTimeout(timeout);
  };

  const handleLongPressEnd = () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
    setSelectedHistory(null);
    toast({
      title: "删除成功",
      description: "已删除选中的对话历史",
    });
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

    const messagesToSend = [
      { role: 'system', content: '你是一个有帮助的AI助手。' },
      ...messages.slice(-10),
      newMessage
    ];

    try {
      const response = await fetch(model.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`,
        },
        body: JSON.stringify({
          model: model.name,
          messages: messagesToSend,
          stream: false,
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
    if (selectedHistory === history.id) {
      setSelectedHistory(null);
    } else if (!selectedHistory) {
      setMessages(history.messages);
    }
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex gap-6">
        <ChatSidebar
          isOpen={isSidebarOpen}
          chatHistory={chatHistory}
          selectedHistory={selectedHistory}
          onNewChat={handleNewChat}
          onHistoryClick={handleHistoryClick}
          onDeleteHistory={handleDeleteHistory}
          onLongPressStart={handleLongPressStart}
          onLongPressEnd={handleLongPressEnd}
        />

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
            <MessageList messages={messages} scrollRef={scrollRef} />
            <ChatInput
              input={input}
              isLoading={isLoading}
              onChange={setInput}
              onSend={handleSend}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
