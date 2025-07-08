'use client';

import React from 'react';

import { Header } from './header';
import { SettingsPanel } from './settings-panel';
import { Sidebar } from './sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
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
  headerTitle = 'Chat Prompt',
  isMobile = false,
  isSettingsPanelOpen = false,
  isSidebarOpen = true,
  onMenuItemClick,
  onSettingsPanelClose,
  onToggleSettingsPanel,
  onToggleSidebar,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white fixed inset-0">
      {/* 사이드바 */}
      <Sidebar
        activeItem={activeMenuItem}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onItemClick={onMenuItemClick}
        onToggle={onToggleSidebar}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* 헤더 */}
        <Header
          isMobile={isMobile}
          isSettingsPanelOpen={isSettingsPanelOpen}
          onToggleSettingsPanel={onToggleSettingsPanel}
          onToggleSidebar={onToggleSidebar}
          title={headerTitle}
        />

        {/* 메인 영역 */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* 우측 설정 패널 */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={onSettingsPanelClose}
      />
    </div>
  );
}
