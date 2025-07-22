import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DiffStore {
  original: string;
  changed: string;
  setOriginal: (value: string) => void;
  setChanged: (value: string) => void;
  setBoth: (original: string, changed: string) => void;
  clear: () => void;
}

export const useDiffStore = create<DiffStore>()(
  persist(
    (set) => ({
      original: '',
      changed: '',
      setOriginal: (value) => set({ original: value }),
      setChanged: (value) => set({ changed: value }),
      setBoth: (original, changed) => set({ original, changed }),
      clear: () => set({ original: '', changed: '' }),
    }),
    {
      name: 'diff-store',
      partialize: (state) => ({
        original: state.original,
        changed: state.changed,
      }),
    }
  )
);
