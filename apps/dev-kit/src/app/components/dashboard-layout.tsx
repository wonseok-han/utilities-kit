'use client';

import { useIsMobile } from '@hooks/use-media-query';
import { useSettingStore } from '@store/setting-store';
import { useSidebarStore } from '@store/sidebar-store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { Header } from './header';
import { SettingsPanel } from './settings-panel';
import { Sidebar } from './sidebar/sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const {
    close: closeSidebar,
    hasHydrated,
    isOpen: isSidebarOpen,
    toggle: onToggleSidebar,
  } = useSidebarStore();
  const { isSettingsPanelOpen, toggleSettingsPanel } = useSettingStore();
  const isMobile = useIsMobile();

  const handleMenuItemClick = (item: string) => {
    if (item === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${item}`);
    }

    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    if (isMobile) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      // 모바일로 전환 시 사이드바 닫기
      closeSidebar();
    }
  }, [isMobile]);

  // localStorage hydration이 완료될 때까지 로딩 화면 표시
  if (!hasHydrated) {
    return (
      <div className="flex h-[100dvh] bg-gray-800 text-white fixed inset-0 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
          <p className="text-gray-300">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-gray-800 text-white fixed inset-0">
      {/* 사이드바 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onItemClick={handleMenuItemClick}
        onToggle={onToggleSidebar}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* 헤더 */}
        <Header
          isSettingsPanelOpen={isSettingsPanelOpen}
          onToggleSettingsPanel={toggleSettingsPanel}
        />

        {/* 메인 영역 */}
        <main className="flex-1 overflow-auto p-2 m-2 bg-gray-900 rounded-t-2xl min-h-0">
          {children}
        </main>
      </div>

      {/* 우측 설정 패널 */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={toggleSettingsPanel}
      />
    </div>
  );
}
