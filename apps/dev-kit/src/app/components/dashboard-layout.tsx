'use client';

import IconLogo from '@assets/icons/icon-logo.svg';
import { Header, SettingsPanel, Sidebar } from '@repo/ui';
import React from 'react';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenuItem?: string;
  isSidebarOpen?: boolean;
  isSettingsPanelOpen?: boolean;
  isMobile?: boolean;
  onMenuItemClick?: (item: string) => void;
  onSettingsPanelClose?: () => void;
  onToggleSidebar?: () => void;
  onToggleSettingsPanel?: () => void;
}

export function DashboardLayout({
  activeMenuItem = 'chat',
  children,
  isMobile = false,
  isSettingsPanelOpen = false,
  isSidebarOpen = true,
  onMenuItemClick,
  onSettingsPanelClose,
  onToggleSettingsPanel,
  onToggleSidebar,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-800 text-white fixed inset-0">
      {/* 사이드바 */}
      <Sidebar
        activeItem={activeMenuItem}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onItemClick={onMenuItemClick}
        onToggle={onToggleSidebar}
        title={
          <div className="relative flex items-center space-x-2 ml-2 mt-2">
            <IconLogo />
            <span
              className={`absolute left-12 whitespace-nowrap transition-all duration-300 overflow-hidden ${
                isSidebarOpen || isMobile
                  ? 'opacity-100 transform scale-x-100 delay-100'
                  : 'opacity-0 transform scale-x-0 origin-left pointer-events-none'
              }`}
            >
              Dev Kit
            </span>
          </div>
        }
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* 헤더 */}
        <Header
          isMobile={isMobile}
          isSettingsPanelOpen={isSettingsPanelOpen}
          onToggleSettingsPanel={onToggleSettingsPanel}
          onToggleSidebar={onToggleSidebar}
        />

        {/* 메인 영역 */}
        <main className="flex-1 overflow-auto p-2 m-2 bg-gray-900 rounded-t-2xl">
          {children}
        </main>
      </div>

      {/* 우측 설정 패널 */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={onSettingsPanelClose}
      />
    </div>
  );
}
