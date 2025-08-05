import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorState {
  content: string;
  shouldIncludeStyles: boolean;
  setContent: (content: string) => void;
  setShouldIncludeStyles: (include: boolean) => void;
  reset: () => void;
}

const DEFAULT_CONTENT = '<p>여기에 내용을 입력하세요.</p>';

export const useEditorStore = create<EditorState>()(
  persist(
    (set, _get) => ({
      content: DEFAULT_CONTENT,
      shouldIncludeStyles: true,

      setContent: (content: string) => {
        set({ content });
      },

      setShouldIncludeStyles: (shouldIncludeStyles: boolean) => {
        set({ shouldIncludeStyles });
      },

      reset: () => {
        set({
          content: DEFAULT_CONTENT,
          shouldIncludeStyles: true,
        });
      },
    }),
    {
      name: 'editor-storage', // 로컬스토리지 키 이름
      partialize: (state) => ({
        content: state.content,
        shouldIncludeStyles: state.shouldIncludeStyles,
      }),
    }
  )
);
