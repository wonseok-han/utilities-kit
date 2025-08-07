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
    language,
    resetSettings,
    setCompactMode,
    setFontSize,
    setLanguage,
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

      {/* 설정 패널 */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-80 bg-gray-800 md:border-l border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">설정</h3>
            <button
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
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
              <h4 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">
                외관
              </h4>
              <div className="space-y-3">
                {/* 테마 설정 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    테마
                  </label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    폰트 크기
                  </label>
                  <input
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    max="20"
                    min="10"
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    step="1"
                    type="range"
                    value={fontSize}
                  />
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {fontSize}px
                  </div>
                </div>

                {/* 컴팩트 모드 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">컴팩트 모드</span>
                  <button
                    className={`w-5 h-5 rounded-full transition-colors ${
                      isCompactMode ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                    onClick={() => setCompactMode(!isCompactMode)}
                  />
                </div>
              </div>
            </div>

            {/* 언어 및 지역 설정 */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">
                언어 및 지역
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  언어
                </label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setLanguage(e.target.value as 'ko' | 'en')}
                  value={language}
                >
                  <option value="ko">🇰🇷 한국어</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>
            </div>

            {/* 초기화 버튼 */}
            <div className="pt-4 border-t border-gray-600">
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors text-sm"
                onClick={() => {
                  // 모든 설정을 기본값으로 초기화
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
