import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Mode = 'encode' | 'decode';

interface JwtStore {
  input: string;
  output: string;
  mode: Mode;
  error: string;
  headerInput: string;
  payloadInput: string;
  encodeOutput: string;
  decodeOutput: string;
  setInput: (input: string) => void;
  setHeaderInput: (input: string) => void;
  setPayloadInput: (input: string) => void;
  setMode: (mode: Mode) => void;
  processText: () => void;
  clearAll: () => void;
  swapMode: () => void;
}

export const useJwtStore = create<JwtStore>()(
  persist(
    (set, get) => ({
      error: '',
      headerInput: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
      input: '',
      mode: 'encode',
      encodeOutput: '',
      decodeOutput: '',
      payloadInput:
        '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',

      output: '',

      setInput: (input: string) => {
        set({ input, error: '' });
      },

      setHeaderInput: (headerInput: string) => {
        set({ headerInput, error: '' });
      },

      setPayloadInput: (payloadInput: string) => {
        set({ payloadInput, error: '' });
      },

      setMode: (mode: Mode) => {
        const { decodeOutput, encodeOutput } = get();
        const output = mode === 'encode' ? encodeOutput : decodeOutput;
        set({ mode, output, error: '' });
      },

      processText: () => {
        const { headerInput, input, mode, payloadInput } = get();

        try {
          let result: string;
          if (mode === 'encode') {
            // JWT 인코딩: Header + Payload를 Base64로 인코딩
            const header = JSON.parse(headerInput);
            const payload = JSON.parse(payloadInput);

            const encodedHeader = btoa(JSON.stringify(header));
            const encodedPayload = btoa(JSON.stringify(payload));

            // 간단한 서명 생성 (실제 서명이 아닌 데모용)
            const signature = btoa('signature');

            result = `${encodedHeader}.${encodedPayload}.${signature}`;
          } else {
            // JWT 디코딩: JWT 토큰을 Header와 Payload로 분리
            const parts = input.split('.');
            if (parts.length !== 3) {
              throw new Error('유효하지 않은 JWT 형식입니다.');
            }

            const [encodedHeader, encodedPayload] = parts;

            if (!encodedHeader || !encodedPayload) {
              throw new Error('유효하지 않은 JWT 형식입니다.');
            }

            const header = JSON.parse(atob(encodedHeader));
            const payload = JSON.parse(atob(encodedPayload));

            result = JSON.stringify(
              {
                header,
                payload,
              },
              null,
              2
            );
          }

          if (mode === 'encode') {
            set({
              encodeOutput: result,
              output: result,
              error: '',
            });
          } else {
            set({
              decodeOutput: result,
              output: result,
              error: '',
            });
          }
        } catch (_error) {
          const errorMessage =
            mode === 'encode'
              ? 'JSON 형식이 올바르지 않습니다. Header와 Payload를 확인해주세요.'
              : '유효하지 않은 JWT 토큰입니다.';

          set({
            error: errorMessage,
            output: '',
          });
        }
      },

      clearAll: () => {
        set({
          decodeOutput: '',
          encodeOutput: '',
          error: '',
          headerInput: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
          input: '',
          output: '',
          payloadInput:
            '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
        });
      },

      swapMode: () => {
        const { decodeOutput, encodeOutput, mode } = get();
        const newMode = mode === 'encode' ? 'decode' : 'encode';
        const currentOutput = mode === 'encode' ? encodeOutput : decodeOutput;
        const newOutput = newMode === 'encode' ? encodeOutput : decodeOutput;

        if (mode === 'encode' && currentOutput) {
          // 인코딩에서 디코딩으로 전환: 생성된 JWT를 입력으로 설정
          set({
            error: '',
            input: currentOutput,
            mode: newMode,
            output: newOutput,
          });
        } else if (mode === 'decode' && currentOutput) {
          // 디코딩에서 인코딩으로 전환: 디코딩된 결과를 Header와 Payload로 설정
          try {
            const decoded = JSON.parse(currentOutput);
            set({
              error: '',
              headerInput: JSON.stringify(decoded.header, null, 2),
              input: '',
              mode: newMode,
              output: newOutput,
              payloadInput: JSON.stringify(decoded.payload, null, 2),
            });
          } catch {
            set({
              error: '',
              input: '',
              mode: newMode,
              output: newOutput,
            });
          }
        } else {
          set({
            error: '',
            input: '',
            mode: newMode,
            output: newOutput,
          });
        }
      },
    }),
    {
      name: 'jwt-store',
      partialize: (state) => ({
        decodeOutput: state.decodeOutput,
        encodeOutput: state.encodeOutput,
        headerInput: state.headerInput,
        input: state.input,
        mode: state.mode,
        payloadInput: state.payloadInput,
      }),
    }
  )
);
