
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

interface ChatSidebarProps {
  isOpen: boolean;
  chatHistory: ChatHistory[];
  selectedHistory: string | null;
  onNewChat: () => void;
  onHistoryClick: (history: ChatHistory) => void;
  onDeleteHistory: (id: string) => void;
  onLongPressStart: (id: string) => void;
  onLongPressEnd: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  chatHistory,
  selectedHistory,
  onNewChat,
  onHistoryClick,
  onDeleteHistory,
  onLongPressStart,
  onLongPressEnd,
}) => {
  return (
    <div 
      className={`${
        isOpen ? 'w-80' : 'w-0 overflow-hidden'
      } transition-all duration-300 ease-in-out`}
    >
      <Card className="h-[calc(100vh-8rem)]">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-xl font-light">对话历史</CardTitle>
          <Button 
            onClick={onNewChat}
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
                  className={`p-3 rounded-lg cursor-pointer transition-colors relative
                    ${selectedHistory === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'}
                  `}
                  onClick={() => onHistoryClick(chat)}
                  onMouseDown={() => onLongPressStart(chat.id)}
                  onMouseUp={onLongPressEnd}
                  onMouseLeave={onLongPressEnd}
                  onTouchStart={() => onLongPressStart(chat.id)}
                  onTouchEnd={onLongPressEnd}
                >
                  <div className="font-medium text-sm">{chat.title}</div>
                  <div className="text-xs text-gray-500">{chat.date}</div>
                  {selectedHistory === chat.id && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistory(chat.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSidebar;
