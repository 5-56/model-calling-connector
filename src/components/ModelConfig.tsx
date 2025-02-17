
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModelConfigProps {
  modelName: string;
  setModelName: (value: string) => void;
  apiUrl: string;
  setApiUrl: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
}

const ModelConfig = ({
  modelName,
  setModelName,
  apiUrl,
  setApiUrl,
  apiKey,
  setApiKey,
}: ModelConfigProps) => {
  return (
    <Card className="w-full max-w-2xl animate-slideIn">
      <CardHeader>
        <CardTitle className="text-2xl font-light">模型配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="modelName">模型名称</Label>
          <Input
            id="modelName"
            placeholder="请输入模型名称"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="transition-all duration-200 hover:border-gray-400 focus:border-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiUrl">API 地址</Label>
          <Input
            id="apiUrl"
            placeholder="请输入API地址"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="transition-all duration-200 hover:border-gray-400 focus:border-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiKey">API 密钥</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="请输入API密钥"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="transition-all duration-200 hover:border-gray-400 focus:border-gray-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelConfig;
