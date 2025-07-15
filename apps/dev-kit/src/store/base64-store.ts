import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Mode = 'encode' | 'decode';

interface Base64Store {
  input: string;
  output: string;
  mode: Mode;
  error: string;
  setInput: (input: string) => void;
  setMode: (mode: Mode) => void;
  processText: () => void;
  clearAll: () => void;
  swapMode: () => void;
}

export const useBase64Store = create<Base64Store>()(
  persist(
    (set, get) => ({
      input: '',
      output: '',
      mode: 'encode',
      error: '',

      setInput: (input: string) => {
        set({ input, error: '' });
      },

      setMode: (mode: Mode) => {
        set({ mode, error: '' });
      },

      processText: () => {
        const { input, mode } = get();

        try {
          let result: string;
          if (mode === 'encode') {
            // TextEncoder를 사용하여 UTF-8 바이트로 변환 후 Base64 인코딩
            const encoder = new TextEncoder();
            const bytes = encoder.encode(input);
            result = btoa(String.fromCharCode(...bytes));
          } else {
            // Base64 디코딩 후 TextDecoder를 사용하여 UTF-8 문자로 복원
            const binaryString = atob(input);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const decoder = new TextDecoder();
            result = decoder.decode(bytes);
          }

          set({
            output: result,
            error: '',
          });
        } catch (_) {
          const errorMessage =
            mode === 'encode'
              ? '인코딩에 실패했습니다.'
              : '올바르지 않은 Base64 형식입니다.';

          set({
            error: errorMessage,
            output: '',
          });
        }
      },

      clearAll: () => {
        set({
          input: '',
          output: '',
          error: '',
        });
      },

      swapMode: () => {
        const { mode, output } = get();
        const newMode = mode === 'encode' ? 'decode' : 'encode';

        set({
          mode: newMode,
          input: output,
          output: '',
          error: '',
        });
      },
    }),
    {
      name: 'base64-store',
      partialize: (state) => ({
        input: state.input,
        mode: state.mode,
      }),
    }
  )
);
