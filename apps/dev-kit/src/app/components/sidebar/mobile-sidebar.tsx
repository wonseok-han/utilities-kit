'use client';

import type { ReactNode } from 'react';

import { SIDEBAR_MENU_ITEMS } from '@constants/menu';

import { getSidebarIcon } from './sidebar-icons';

export interface MobileSidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  title?: ReactNode;
}

export function MobileSidebar({
  activeItem = 'dashboard',
  isOpen = false,
  onItemClick,
  onToggle,
  title,
}: MobileSidebarProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* 모바일 사이드바 */}
      <div
        className={`fixed left-0 top-0 h-full w-full bg-gray-800 flex flex-col z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <button
              className="text-lg font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => onItemClick?.('dashboard')}
              title="대시보드로 이동"
            >
              {title}
            </button>
            <button
              className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors hover:bg-gray-700 cursor-pointer"
              onClick={onToggle}
              title="사이드바 닫기"
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
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {SIDEBAR_MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                activeItem === item.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => onItemClick?.(item.id)}
            >
              <svg
                className="w-5 h-5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {getSidebarIcon(item.icon)}
              </svg>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
