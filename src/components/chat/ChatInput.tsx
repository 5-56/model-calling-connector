
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onChange,
  onSend,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const clearInput = () => {
    onChange('');
  };

  return (
    <div className="relative flex flex-col gap-2 mt-4">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入您的消息... (Shift + Enter 换行)"
          onKeyPress={handleKeyPress}
          className="min-h-[80px] max-h-[200px] pr-10 resize-y"
          disabled={isLoading}
        />
        {input && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 hover:bg-destructive hover:text-white"
            onClick={clearInput}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button 
        onClick={onSend} 
        disabled={isLoading}
        className="w-full transition-all duration-200"
      >
        {isLoading ? "正在思考..." : "发送"}
      </Button>
    </div>
  );
};

export default ChatInput;
