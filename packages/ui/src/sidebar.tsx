'use client';

export interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  isOpen?: boolean;
  isMobile?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'json-formatter', label: 'JSON 포맷터', icon: 'json' },
  { id: 'base64-encoder', label: 'Base64 인코더', icon: 'encode' },
  { id: 'jwt-decoder', label: 'JWT 디코더', icon: 'jwt' },
  { id: 'timestamp-converter', label: 'Timestamp 변환', icon: 'time' },
  { id: 'regex-tester', label: '정규식 테스트', icon: 'regex' },
  { id: 'type-generator', label: '타입 생성기', icon: 'type' },
  { id: 'release-generator', label: '릴리즈 노트 생성기', icon: 'release' },
  { id: 'diff-checker', label: 'Diff 비교기', icon: 'diff' },
  { id: 'web-editor', label: '웹에디터', icon: 'editor' },
  { id: 'storage-viewer', label: 'Storage 뷰어', icon: 'storage' },
];

const getIcon = (iconType: string) => {
  const icons = {
    dashboard: (
      <path
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2zM3 7l9 6 9-6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    json: (
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    encode: (
      <path
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    jwt: (
      <path
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    time: (
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    regex: (
      <path
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    type: (
      <path
        d="M7 21h10M12 17V7m-5 10l5-10 5 10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    release: (
      <path
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    diff: (
      <path
        d="M4 6h16M4 12h16M4 18h16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    editor: (
      <path
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    storage: (
      <path
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    chat: (
      <path
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.646-1.297l-5.823 2.032a.75.75 0 01-.977-.977l2.032-5.823A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    stream: (
      <path
        d="M13 10V3L4 14h7v7l9-11h-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    generate: (
      <path
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    build: (
      <path
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    history: (
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    save: (
      <path
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
  };
  return icons[iconType as keyof typeof icons] || icons.chat;
};

export function Sidebar({
  activeItem = 'chat',
  isMobile = false,
  isOpen = true,
  onItemClick,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* 모바일에서 사이드바가 열려있을 때 배경 오버레이 */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <div
        className={`bg-gray-800 flex flex-col transition-all duration-300 ${
          isMobile
            ? `fixed left-0 top-0 h-full w-full z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : isOpen
              ? 'w-64'
              : 'w-16'
        }`}
      >
        {/* 로고 */}
        <div className="p-4">
          {isOpen || !isMobile ? (
            <div className="flex items-center justify-between">
              <h1
                className={`text-lg font-semibold text-white transition-all duration-300 delay-100 ${!isOpen && !isMobile ? 'hidden' : ''}`}
              >
                Dev Tools
              </h1>
              <button
                className="group relative p-2 text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:shadow-lg cursor-pointer"
                onClick={onToggle}
                title="사이드바 접기"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                {/* 호버시 나타나는 배경 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </div>
          ) : (
            <button
              className="group relative w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 border border-blue-500/20 cursor-pointer"
              onClick={onToggle}
              title="사이드바 펼치기"
            >
              <svg
                className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
              {/* 내부 글로우 효과 */}
              <div className="absolute inset-0.5 bg-gradient-to-br from-white/15 to-transparent rounded-lg pointer-events-none" />
              {/* 호버 시 펄스 효과 */}
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            </button>
          )}
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`relative flex items-center rounded-lg cursor-pointer transition-colors group ${
                isOpen || isMobile ? 'px-3 py-2' : 'justify-center p-2'
              } ${
                activeItem === item.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => onItemClick?.(item.id)}
              title={!isOpen && !isMobile ? item.label : undefined}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {getIcon(item.icon)}
              </svg>

              {/* 텍스트를 absolute로 배치하여 레이아웃에 영향 없음 */}
              <span
                className={`absolute left-12 whitespace-nowrap transition-all duration-300 overflow-hidden ${
                  isOpen || isMobile
                    ? 'opacity-100 transform scale-x-100 delay-100'
                    : 'opacity-0 transform scale-x-0 origin-left pointer-events-none'
                }`}
              >
                {item.label}
              </span>

              {/* 툴팁 (접힌 상태일 때) */}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
