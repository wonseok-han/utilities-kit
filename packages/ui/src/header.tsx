'use client';

export interface HeaderProps {
  title?: string;
  onSettingsClick?: () => void;
  onToggleSidebar?: () => void;
  onToggleSettingsPanel?: () => void;
  isSettingsPanelOpen?: boolean;
  isMobile?: boolean;
}

export function Header({
  isMobile = false,
  isSettingsPanelOpen = false,
  onSettingsClick,
  onToggleSettingsPanel,
  onToggleSidebar,
  title,
}: HeaderProps) {
  return (
    <header className="bg-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* 모바일 햄버거 메뉴 버튼 */}
          {isMobile && (
            <button
              className="p-2 mr-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              onClick={onToggleSidebar}
              title="메뉴 열기"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
          <h2 className="text-lg font-medium text-white">{title}</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* 기존 설정 버튼 (호환성을 위해 유지) */}
          {onSettingsClick && (
            <button
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              onClick={onSettingsClick}
              title="설정"
            >
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          )}

          {/* 설정패널 토글 버튼 */}
          {/* TODO: 추후 추가 예정 */}
          <button
            className={`p-2 rounded-md transition-colors cursor-pointer invisible ${
              isSettingsPanelOpen
                ? 'text-white bg-gray-700'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            onClick={onToggleSettingsPanel}
            title={isSettingsPanelOpen ? '설정패널 닫기' : '설정패널 열기'}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
