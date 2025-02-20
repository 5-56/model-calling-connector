
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex gap-2 mt-4">
      <Input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入您的消息..."
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        className="flex-1"
        disabled={isLoading}
      />
      <Button 
        onClick={onSend} 
        disabled={isLoading}
      >
        {isLoading ? "发送中..." : "发送"}
      </Button>
    </div>
  );
};

export default ChatInput;
