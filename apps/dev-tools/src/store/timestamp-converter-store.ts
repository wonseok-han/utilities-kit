import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimestampConverterStore {
  input: string;
  selectedTimezones: string[];
  selectedFormats: string[];
  setInput: (input: string) => void;
  setSelectedTimezones: (timezones: string[]) => void;
  setSelectedFormats: (formats: string[]) => void;
  clearAll: () => void;
}

export const useTimestampConverterStore = create<TimestampConverterStore>()(
  persist(
    (set) => ({
      input: '',
      selectedTimezones: [],
      selectedFormats: [],
      setInput: (input: string) => set({ input }),
      setSelectedTimezones: (selectedTimezones: string[]) =>
        set({ selectedTimezones }),
      setSelectedFormats: (selectedFormats: string[]) =>
        set({ selectedFormats }),
      clearAll: () =>
        set({ input: '', selectedTimezones: [], selectedFormats: [] }),
    }),
    {
      name: 'timestamp-converter-store',
      partialize: (state) => ({
        input: state.input,
        selectedTimezones: state.selectedTimezones,
        selectedFormats: state.selectedFormats,
      }),
    }
  )
);
