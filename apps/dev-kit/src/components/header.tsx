'use client';

import { IconGithub, IconLogo } from '@assets/icons';
import { useIsMobile } from '@hooks/use-media-query';
import { useSidebarStore } from '@store/sidebar-store';
import Link from 'next/link';

export interface HeaderProps {
  onToggleSettingsPanel?: () => void;
  isSettingsPanelOpen?: boolean;
}

export function Header({
  isSettingsPanelOpen = false,
  onToggleSettingsPanel,
}: HeaderProps) {
  const isMobile = useIsMobile();
  const { toggle: onToggleSidebar } = useSidebarStore();

  return (
    <header className="bg-gray-800 px-6 py-2">
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

          {isMobile && (
            <div className="flex items-center gap-3 text-white">
              <div className="relative flex items-center">
                <IconLogo />
                <span
                  className={`absolute left-12 whitespace-nowrap transition-all duration-300 overflow-hidden font-bold opacity-100 transform scale-x-100 delay-100`}
                >
                  Dev Kit
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Link
            aria-label="GitHub Repository"
            className="hover:text-gray-200 transition-colors duration-200 p-1 rounded hover:bg-gray-700/50 p-1"
            href="https://github.com/wonseok-han/utilities-kit"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconGithub className="w-4 h-4" />
          </Link>

          {/* 설정패널 토글 버튼 */}
          {/* TODO: 추후 추가 예정 */}
          <button
            className={`p-1 rounded-md transition-colors cursor-pointer hidden ${
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
