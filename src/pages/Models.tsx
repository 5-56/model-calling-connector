
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import useModels from '../hooks/useModels';

const Models = () => {
  const navigate = useNavigate();
  const { models, removeModel } = useModels();

  const handleDelete = (id: string) => {
    removeModel(id);
  };

  const handleAddModel = () => {
    navigate('/'); // 跳转到配置页面
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light">模型列表</h1>
        <Button onClick={handleAddModel}>
          <Plus className="mr-2 h-4 w-4" />
          添加模型
        </Button>
      </div>
      <div className="grid gap-4">
        {models.map((model) => (
          <Card key={model.id} className="animate-fadeIn">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-lg font-medium">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.apiUrl}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(model.id)}
                  title="删除模型"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Models;
