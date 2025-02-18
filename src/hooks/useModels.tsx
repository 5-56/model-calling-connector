
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface Model {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
}

interface ModelsStore {
  models: Model[];
  addModel: (model: Model) => void;
  removeModel: (id: string) => void;
  getModel: (id: string) => Model | undefined;
}

// 默认的 DeepSeek 模型配置
const defaultModel: Model = {
  id: uuidv4(),
  name: "deepseek-ai/DeepSeek-R1",
  apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
  apiKey: "sk-qdwhgvcvfmtihpchablxlynqgtuxnurhstpuwmerarxlxcwc"
};

const useModels = create<ModelsStore>()(
  persist(
    (set, get) => ({
      models: [defaultModel], // 初始化时包含默认模型
      addModel: (model) => set((state) => ({
        models: [...state.models, { ...model, id: uuidv4() }]
      })),
      removeModel: (id) => set((state) => ({
        models: state.models.filter((m) => m.id !== id)
      })),
      getModel: (id) => get().models.find((m) => m.id === id)
    }),
    {
      name: 'models-storage'
    }
  )
);

export default useModels;
