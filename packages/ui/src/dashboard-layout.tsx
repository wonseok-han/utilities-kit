'use client';

import React from 'react';

import { Header } from './header';
import { SettingsPanel } from './settings-panel';
import { Sidebar } from './sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  activeMenuItem?: string;
  showSettingsPanel?: boolean;
  onMenuItemClick?: (item: string) => void;
  onSettingsPanelClose?: () => void;
}

export function DashboardLayout({
  activeMenuItem = 'chat',
  children,
  headerTitle = 'Chat Prompt',
  onMenuItemClick,
  onSettingsPanelClose,
  showSettingsPanel = true,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white fixed inset-0">
      {/* 사이드바 */}
      <Sidebar activeItem={activeMenuItem} onItemClick={onMenuItemClick} />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <Header title={headerTitle} />

        {/* 메인 영역 */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* 우측 설정 패널 */}
      {showSettingsPanel && (
        <SettingsPanel
          isOpen={showSettingsPanel}
          onClose={onSettingsPanelClose}
        />
      )}
    </div>
  );
}
