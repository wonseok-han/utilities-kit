import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JsonState {
  input: string;
  output: string;
  error: string;
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setError: (error: string) => void;
  formatJson: () => void;
  minifyJson: () => void;
  clearAll: () => void;
}

export const useJsonStore = create<JsonState>()(
  persist(
    (set, get) => ({
      input: '',
      output: '',
      error: '',

      setInput: (input: string) => set({ input }),
      setOutput: (output: string) => set({ output }),
      setError: (error: string) => set({ error }),

      formatJson: () => {
        const { input } = get();
        try {
          const parsed = JSON.parse(input);
          set({
            output: JSON.stringify(parsed, null, 2),
            error: '',
          });
        } catch (_) {
          set({
            error: '잘못된 JSON 형식입니다.',
            output: '',
          });
        }
      },

      minifyJson: () => {
        const { input } = get();
        try {
          const parsed = JSON.parse(input);
          set({
            output: JSON.stringify(parsed),
            error: '',
          });
        } catch (_) {
          set({
            error: '잘못된 JSON 형식입니다.',
            output: '',
          });
        }
      },

      clearAll: () =>
        set({
          input: '',
          output: '',
          error: '',
        }),
    }),
    {
      name: 'json-formatter-store', // localStorage key name
      partialize: (state) => ({
        input: state.input,
        output: state.output,
      }), // only persist input and output, not error
    }
  )
);
