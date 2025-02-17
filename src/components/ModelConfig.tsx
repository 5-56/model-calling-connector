
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
        <CardTitle className="text-2xl font-light">Model Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="modelName">Model Name</Label>
          <Input
            id="modelName"
            placeholder="Enter model name"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="transition-all duration-200 hover:border-gray-400 focus:border-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiUrl">API URL</Label>
          <Input
            id="apiUrl"
            placeholder="Enter API endpoint URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="transition-all duration-200 hover:border-gray-400 focus:border-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter API key"
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
