import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingState {
  // 외관 설정
  theme: 'light' | 'dark' | 'system';
  fontSize: number;

  // 기능 설정
  codeTheme: string;
  autoFormat: boolean;
  autoCopy: boolean;
  autoSave: boolean;
  showNotifications: boolean;
  keyboardShortcuts: boolean;
  resultDisplayMode: 'card' | 'list' | 'table';
  maxHistoryItems: number;
  debugMode: boolean;

  // 설정 패널 상태
  isSettingsPanelOpen: boolean;

  // 액션들
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
  setCodeTheme: (theme: string) => void;
  setAutoFormat: (enabled: boolean) => void;
  setAutoCopy: (enabled: boolean) => void;
  setAutoSave: (enabled: boolean) => void;
  setShowNotifications: (enabled: boolean) => void;
  setKeyboardShortcuts: (enabled: boolean) => void;
  setResultDisplayMode: (mode: 'card' | 'list' | 'table') => void;
  setMaxHistoryItems: (count: number) => void;
  setDebugMode: (enabled: boolean) => void;
  setIsSettingsPanelOpen: (open: boolean) => void;
  toggleSettingsPanel: () => void;

  // 설정 초기화
  resetSettings: () => void;

  // hydration 상태
  hasHydrated: boolean;
}

const defaultSettings = {
  theme: 'system' as const,
  fontSize: 14,
  codeTheme: 'vs-dark',
  autoFormat: true,
  autoCopy: false,
  autoSave: true,
  showNotifications: true,
  keyboardShortcuts: true,
  resultDisplayMode: 'card' as const,
  maxHistoryItems: 50,
  debugMode: false,
  isSettingsPanelOpen: false,
};

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      hasHydrated: false,

      // 액션들
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setCodeTheme: (codeTheme) => set({ codeTheme }),
      setAutoFormat: (autoFormat) => set({ autoFormat }),
      setAutoCopy: (autoCopy) => set({ autoCopy }),
      setAutoSave: (autoSave) => set({ autoSave }),
      setShowNotifications: (showNotifications) => set({ showNotifications }),
      setKeyboardShortcuts: (keyboardShortcuts) => set({ keyboardShortcuts }),
      setResultDisplayMode: (resultDisplayMode) => set({ resultDisplayMode }),
      setMaxHistoryItems: (maxHistoryItems) => set({ maxHistoryItems }),
      setDebugMode: (debugMode) => set({ debugMode }),
      setIsSettingsPanelOpen: (isSettingsPanelOpen) =>
        set({ isSettingsPanelOpen }),
      toggleSettingsPanel: () =>
        set((state) => ({ isSettingsPanelOpen: !state.isSettingsPanelOpen })),

      // 설정 초기화
      resetSettings: () => set({ ...defaultSettings }),
    }),
    {
      name: 'setting-store', // localStorage 키 이름
      onRehydrateStorage: () => (state) => {
        // localStorage 복원이 완료되면 hasHydrated를 true로 설정
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
