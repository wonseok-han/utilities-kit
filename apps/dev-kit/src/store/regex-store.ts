import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegexStore {
  pattern: string;
  testString: string;
  flags: string;
  matches: RegExpMatchArray[] | null;
  error: string;
  setPattern: (pattern: string) => void;
  setTestString: (testString: string) => void;
  setFlags: (flags: string) => void;
  testRegex: () => void;
  clearAll: () => void;
}

export const useRegexStore = create<RegexStore>()(
  persist(
    (set, get) => ({
      pattern: '',
      testString: '',
      flags: '',
      matches: null,
      error: '',

      setPattern: (pattern: string) => {
        set({ pattern, error: '' });
      },

      setTestString: (testString: string) => {
        set({ testString, error: '' });
      },

      setFlags: (flags: string) => {
        set({ flags, error: '' });
      },

      testRegex: () => {
        const { flags, pattern, testString } = get();

        if (!pattern.trim()) {
          set({ error: '정규식 패턴을 입력해주세요.', matches: null });
          return;
        }

        if (!testString.trim()) {
          set({ error: '테스트할 문자열을 입력해주세요.', matches: null });
          return;
        }

        try {
          const regex = new RegExp(pattern, flags);
          const matches = Array.from(testString.matchAll(regex));

          set({
            matches: matches.length > 0 ? matches : null,
            error: '',
          });
        } catch {
          set({
            error: '올바르지 않은 정규식 패턴입니다.',
            matches: null,
          });
        }
      },

      clearAll: () => {
        set({
          pattern: '',
          testString: '',
          flags: '',
          matches: null,
          error: '',
        });
      },
    }),
    {
      name: 'regex-tester-storage',
      partialize: (state) => ({
        pattern: state.pattern,
        testString: state.testString,
        flags: state.flags,
      }),
    }
  )
);
