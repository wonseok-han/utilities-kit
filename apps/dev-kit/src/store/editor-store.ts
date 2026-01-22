import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_CONTENT = '<p>여기에 내용을 입력하세요.</p>';

type UploadModeType = 'base64' | 'api';

interface EditorState {
  content: string;
  shouldIncludeStyles: boolean;
  showHtmlPreview: boolean;
  uploadMode: UploadModeType;
  setContent: (content: string) => void;
  setShouldIncludeStyles: (include: boolean) => void;
  setShowHtmlPreview: (show: boolean) => void;
  setUploadMode: (mode: UploadModeType) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, _get) => ({
      content: DEFAULT_CONTENT,
      shouldIncludeStyles: true,
      showHtmlPreview: false,
      uploadMode: 'base64',

      setContent: (content: string) => {
        set({ content });
      },

      setShouldIncludeStyles: (shouldIncludeStyles: boolean) => {
        set({ shouldIncludeStyles });
      },

      setShowHtmlPreview: (showHtmlPreview: boolean) => {
        set({ showHtmlPreview });
      },

      setUploadMode: (uploadMode: UploadModeType) => {
        set({ uploadMode });
      },

      reset: () => {
        set({
          content: DEFAULT_CONTENT,
          shouldIncludeStyles: true,
          showHtmlPreview: false,
          uploadMode: 'base64',
        });
      },
    }),
    {
      name: 'editor-storage', // 로컬스토리지 키 이름
      partialize: (state) => {
        // localStorage 용량 제한을 고려하여 큰 base64 이미지가 포함된 경우 content를 저장하지 않음
        const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB (localStorage는 보통 5-10MB 제한)
        const hasLargeBase64 =
          state.content.includes('data:image') &&
          state.content.length > MAX_STORAGE_SIZE;

        return {
          // 큰 base64 이미지가 포함된 경우 content를 저장하지 않음
          content: hasLargeBase64 ? DEFAULT_CONTENT : state.content,
          shouldIncludeStyles: state.shouldIncludeStyles,
          showHtmlPreview: state.showHtmlPreview,
          uploadMode: state.uploadMode,
        };
      },
    }
  )
);
