
import React from 'react';
import ModelConfig from '../components/ModelConfig';
import ModelTesting from '../components/ModelTesting';

const Index = () => {
  const [modelName, setModelName] = React.useState("");
  const [apiUrl, setApiUrl] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-light tracking-tight">自定义模型连接器</h1>
            <p className="text-gray-500">配置并测试您的AI模型接口</p>
          </div>
          <ModelConfig
            modelName={modelName}
            setModelName={setModelName}
            apiUrl={apiUrl}
            setApiUrl={setApiUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
          />
          <ModelTesting
            modelName={modelName}
            apiUrl={apiUrl}
            apiKey={apiKey}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
