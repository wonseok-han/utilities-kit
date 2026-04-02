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
      className={`bg-surface flex flex-col transition-all duration-300 ${
        isOpen ? 'min-w-64' : 'min-w-16'
      }`}
    >
      {/* 로고 */}
      <div className="p-4">
        {isOpen ? (
          <div className="flex items-center justify-between">
            <button
              className="text-lg font-semibold text-on-surface hover:text-accent transition-all duration-300 delay-100 cursor-pointer"
              onClick={() => onItemClick?.('/')}
              title="대시보드로 이동"
            >
              {title}
            </button>
            <button
              className="group relative p-2 text-on-surface-muted hover:text-on-surface rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-surface-elevated hover:to-surface-skeleton hover:shadow-lg cursor-pointer"
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
            className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-elevated transition-colors cursor-pointer"
            onClick={onToggle}
            title="사이드바 펼치기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
                ? 'bg-surface-elevated text-on-surface'
                : 'text-on-surface-secondary hover:bg-surface-elevated'
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
              className={`absolute left-12 right-3 truncate transition-all duration-300 ${
                isOpen
                  ? 'opacity-100 transform scale-x-100 delay-100'
                  : 'opacity-0 transform scale-x-0 origin-left pointer-events-none'
              }`}
            >
              {item.label}
            </span>

            {/* 툴팁 (접힌 상태일 때) */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface-deep text-on-surface text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
