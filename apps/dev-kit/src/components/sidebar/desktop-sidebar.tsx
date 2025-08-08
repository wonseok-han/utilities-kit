'use client';

import { SIDEBAR_MENU_ITEMS } from '@constants/menu';
import { type ReactNode } from 'react';

import { getSidebarIcon } from './sidebar-icons';

export interface DesktopSidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  title?: ReactNode;
}

export function DesktopSidebar({
  activeItem = 'dashboard',
  isOpen = true,
  onItemClick,
  onToggle,
  title,
}: DesktopSidebarProps) {
  return (
    <div
      className={`bg-gray-800 flex flex-col transition-all duration-300 ${
        isOpen ? 'min-w-64' : 'min-w-16'
      }`}
    >
      {/* 로고 */}
      <div className="p-4">
        {isOpen ? (
          <div className="flex items-center justify-between">
            <button
              className="text-lg font-semibold text-white hover:text-blue-400 transition-all duration-300 delay-100 cursor-pointer"
              onClick={() => onItemClick?.('/')}
              title="대시보드로 이동"
            >
              {title}
            </button>
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
        {SIDEBAR_MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`relative flex items-center rounded-lg cursor-pointer transition-colors group ${
              isOpen ? 'px-3 py-2' : 'justify-center p-2'
            } ${
              activeItem === item.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onItemClick?.(item.path)}
            title={!isOpen ? item.label : undefined}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {getSidebarIcon(item.icon)}
            </svg>

            {/* 텍스트를 absolute로 배치하여 레이아웃에 영향 없음 */}
            <span
              className={`absolute left-12 whitespace-nowrap transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'opacity-100 transform scale-x-100 delay-100'
                  : 'opacity-0 transform scale-x-0 origin-left pointer-events-none'
              }`}
            >
              {item.label}
            </span>

            {/* 툴팁 (접힌 상태일 때) */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
