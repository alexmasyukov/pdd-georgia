import { create } from 'zustand';

interface CategoryUpdateStore {
  needToCategoryButtonsUpdate: number;
  triggerCategoryButtonsUpdate: () => void;
}

const useCategoryUpdateStore = create<CategoryUpdateStore>((set) => ({
  needToCategoryButtonsUpdate: 0,
  triggerCategoryButtonsUpdate: () => set({ needToCategoryButtonsUpdate: Date.now() }),
}));

export default useCategoryUpdateStore;