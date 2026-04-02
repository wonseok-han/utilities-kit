'use client';

import { useSettingStore } from '@store/setting-store';

export interface SettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SettingsPanel({ isOpen = true, onClose }: SettingsPanelProps) {
  const {
    compactMode: isCompactMode,
    fontSize,
    resetSettings,
    setCompactMode,
    setFontSize,
    setTheme,
    theme,
  } = useSettingStore();
  return (
    <>
      {/* 배경 오버레이 - 설정패널 영역을 제외한 나머지 화면 */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 bottom-0 bg-black opacity-40 z-40 transition-opacity duration-300 md:block hidden"
          onClick={onClose}
          style={{ right: '320px' }}
        />
      )}

      {/* 모바일용 전체 화면 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 transition-opacity duration-300 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 설정 패널 - 모바일: 풀스크린(아래에서 위로), 데스크톱: 우측 패널 */}
      <div
        className={`fixed bg-surface transform transition-transform duration-300 ease-in-out z-50 inset-0 md:inset-auto md:right-0 md:top-0 md:h-full md:w-80 md:border-l border-border ${
          isOpen
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-on-surface">설정</h3>
            <button
              className="text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* 외관 설정 */}
            <div>
              <h4 className="text-sm font-medium text-on-surface-secondary mb-3 border-b border-border-light pb-1">
                외관
              </h4>
              <div className="space-y-3">
                {/* 테마 설정 */}
                <div>
                  <label className="block text-sm font-medium text-on-surface-secondary mb-2">
                    테마
                  </label>
                  <select
                    className="w-full bg-input-bg border border-input-border rounded-md px-3 py-2 text-on-surface focus:ring-2 focus:ring-accent focus:border-transparent"
                    onChange={(e) =>
                      setTheme(e.target.value as 'light' | 'dark' | 'system')
                    }
                    value={theme}
                  >
                    <option value="system">🌗 시스템 기본값</option>
                    <option value="light">☀️ 라이트 모드</option>
                    <option value="dark">🌙 다크 모드</option>
                  </select>
                </div>

                {/* 폰트 크기 */}
                <div>
                  <label className="block text-sm font-medium text-on-surface-secondary mb-2">
                    폰트 크기
                  </label>
                  <input
                    className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer slider"
                    max="20"
                    min="10"
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    step="1"
                    type="range"
                    value={fontSize}
                  />
                  <div className="text-right text-sm text-on-surface-muted mt-1">
                    {fontSize}px
                  </div>
                </div>

                {/* 컴팩트 모드 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-muted">
                    컴팩트 모드
                  </span>
                  <button
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      isCompactMode ? 'bg-blue-500' : 'bg-surface-skeleton'
                    }`}
                    onClick={() => setCompactMode(!isCompactMode)}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        isCompactMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 초기화 버튼 */}
            <div className="pt-4 border-t border-border-light">
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors text-sm"
                onClick={() => {
                  resetSettings();
                }}
              >
                🔄 설정 초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
