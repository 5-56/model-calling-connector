
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

const useModels = create<ModelsStore>()(
  persist(
    (set, get) => ({
      models: [],
      addModel: (model) => set((state) => ({
        models: [...state.models, model]
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
