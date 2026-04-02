'use client';

import { useSettingStore } from '@store/setting-store';

export interface SettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/** 미니 레이아웃 프리뷰 - 사이드바+콘텐츠 형태로 테마를 시각화 */
function ThemePreview({ mode }: { mode: 'light' | 'dark' | 'system' }) {
  const light = { sidebar: '#dfe6ee', content: '#ffffff', text: '#c0c8d2' };
  const dark = { sidebar: '#1f2937', content: '#111827', text: '#374151' };

  if (mode === 'system') {
    return (
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 48 34"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill={dark.sidebar} height="34" rx="4" width="48" />
        {/* 다크 반쪽 */}
        <clipPath id="darkHalf">
          <rect height="34" width="24" />
        </clipPath>
        <g clipPath="url(#darkHalf)">
          <rect fill={dark.sidebar} height="34" rx="4" width="48" />
          <rect
            fill={dark.content}
            height="30"
            rx="3"
            width="33"
            x="13"
            y="2"
          />
          <rect fill={dark.text} height="2" rx="1" width="8" x="2" y="8" />
          <rect fill={dark.text} height="2" rx="1" width="6" x="2" y="13" />
          <rect fill={dark.text} height="2" rx="1" width="7" x="2" y="18" />
        </g>
        {/* 라이트 반쪽 */}
        <clipPath id="lightHalf">
          <rect height="34" width="24" x="24" />
        </clipPath>
        <g clipPath="url(#lightHalf)">
          <rect fill={light.sidebar} height="34" rx="4" width="48" />
          <rect
            fill={light.content}
            height="30"
            rx="3"
            width="33"
            x="13"
            y="2"
          />
          <rect fill={light.text} height="2" rx="1" width="8" x="2" y="8" />
          <rect fill={light.text} height="2" rx="1" width="6" x="2" y="13" />
          <rect fill={light.text} height="2" rx="1" width="7" x="2" y="18" />
        </g>
        {/* 대각선 구분 */}
        <line
          stroke="#9ca3af"
          strokeWidth="0.5"
          x1="24"
          x2="24"
          y1="0"
          y2="34"
        />
      </svg>
    );
  }

  const c = mode === 'light' ? light : dark;
  return (
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 48 34"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={c.sidebar} height="34" rx="4" width="48" />
      <rect fill={c.content} height="30" rx="3" width="33" x="13" y="2" />
      {/* 사이드바 메뉴 라인 */}
      <rect fill={c.text} height="2" rx="1" width="8" x="2" y="8" />
      <rect fill={c.text} height="2" rx="1" width="6" x="2" y="13" />
      <rect fill={c.text} height="2" rx="1" width="7" x="2" y="18" />
      {/* 콘텐츠 라인 */}
      <rect fill={c.text} height="2" rx="1" width="16" x="17" y="8" />
      <rect fill={c.text} height="2" rx="1" width="12" x="17" y="13" />
    </svg>
  );
}

const THEME_OPTIONS = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' },
] as const;

export function SettingsPanel({ isOpen = true, onClose }: SettingsPanelProps) {
  const { fontSize, resetSettings, setFontSize, setTheme, theme } =
    useSettingStore();

  return (
    <>
      {/* 배경 오버레이 - 모바일만 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 모바일: fixed 풀스크린 / 데스크톱: flex 안에서 밀어내기 */}
      <div
        className={`bg-surface transition-[margin] duration-300 ease-in-out
          fixed inset-0 z-50 transform md:transform-none
          md:relative md:inset-auto md:z-auto md:w-80 md:min-w-80 md:border-l border-border
          ${isOpen ? 'translate-y-0 md:mr-0' : 'translate-y-full md:-mr-80'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-on-surface-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7 7 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold text-on-surface">설정</h3>
            </div>
            <button
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-elevated transition-colors cursor-pointer"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 테마 */}
            <section>
              <h4 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-3">
                테마
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      theme === opt.value
                        ? 'border-accent bg-accent/10 shadow-sm'
                        : 'border-border hover:border-on-surface-muted/30'
                    }`}
                    onClick={() => setTheme(opt.value)}
                  >
                    <div className="w-full aspect-[48/34] rounded-md overflow-hidden border border-border/50">
                      <ThemePreview mode={opt.value} />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        theme === opt.value
                          ? 'text-accent'
                          : 'text-on-surface-muted'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 폰트 크기 */}
            <section>
              <h4 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-3">
                폰트 크기
              </h4>
              <div className="bg-surface-elevated/30 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated hover:bg-surface-skeleton text-on-surface-secondary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={fontSize <= 10}
                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 12h14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span className="text-2xl font-bold text-on-surface tabular-nums">
                    {fontSize}
                    <span className="text-sm font-normal text-on-surface-muted ml-0.5">
                      px
                    </span>
                  </span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated hover:bg-surface-skeleton text-on-surface-secondary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={fontSize >= 20}
                    onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 5v14m-7-7h14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  className="w-full h-1.5 bg-surface-elevated rounded-full appearance-none cursor-pointer accent-accent"
                  max="20"
                  min="10"
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  step="1"
                  type="range"
                  value={fontSize}
                />
                <div className="flex justify-between text-[10px] text-on-surface-muted mt-1.5 px-0.5">
                  <span>작게</span>
                  <span>크게</span>
                </div>
              </div>
            </section>
          </div>

          {/* 하단 초기화 */}
          <div className="p-5 border-t border-border">
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-danger border border-danger/30 hover:bg-danger/10 transition-colors cursor-pointer"
              onClick={() => resetSettings()}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              설정 초기화
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
