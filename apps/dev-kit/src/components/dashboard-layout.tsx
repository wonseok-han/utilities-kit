'use client';

import { useIsMobile } from '@hooks/use-media-query';
import { usePrevious } from '@hooks/use-previous';
import { useDeviceStore } from '@store/device-store';
import { useSettingStore } from '@store/setting-store';
import { useSidebarStore } from '@store/sidebar-store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { Header } from './header';
import { LayoutSkeleton } from './layout-skeleton';
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
    open: openSidebar,
    toggle: onToggleSidebar,
  } = useSidebarStore();
  const { isSettingsPanelOpen, toggleSettingsPanel } = useSettingStore();
  const isMobile = useIsMobile();
  const {
    hasHydrated: hasDeviceHydrated,
    isMobile: isDeviceMobile,
    setIsMobile,
  } = useDeviceStore();
  const usePrevIsDeviceMobile = usePrevious(isDeviceMobile);

  const handleMenuItemClick = (path: string) => {
    router.push(path);

    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    if (isDeviceMobile) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (isMobile !== undefined && isMobile !== null) {
      setIsMobile(isMobile);
    }

    if (isMobile) {
      // 모바일로 전환 시 사이드바 닫기
      closeSidebar();
    }
  }, [isMobile, setIsMobile, closeSidebar]);

  useEffect(() => {
    // 이전 값이 true(모바일)였고, 현재 false(데스크탑)로 바뀌는 순간만 실행
    if (usePrevIsDeviceMobile === true && isDeviceMobile === false) {
      openSidebar();
    }
  }, [isDeviceMobile, usePrevIsDeviceMobile, openSidebar]);

  // localStorage hydration이 완료될 때까지 로딩 화면 표시
  if (!hasHydrated && !hasDeviceHydrated) {
    return <LayoutSkeleton />;
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
