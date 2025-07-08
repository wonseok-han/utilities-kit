'use client';

import type { PropsWithChildren } from 'react';

import { DashboardLayout } from '@repo/ui';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

interface PageMetadata {
  title: string;
  activeMenuItem: string;
}

// 경로별 기본 메타데이터 매핑
const getPageMetadata = (pathname: string): PageMetadata => {
  switch (pathname) {
    case '/':
      return { title: '개발자 도구', activeMenuItem: 'dashboard' };
    case '/base64-encoder':
      return { title: 'Base64 인코더', activeMenuItem: 'base64-encoder' };
    case '/json-formatter':
      return { title: 'JSON 포맷터', activeMenuItem: 'json-formatter' };
    default:
      return { title: '개발자 도구', activeMenuItem: 'dashboard' };
  }
};

export function DashboardProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const pageMetadata = getPageMetadata(pathname);

  // 사이드바와 설정패널 토글 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const handleMenuItemClick = (item: string) => {
    if (item === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${item}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleSettingsPanel = () => {
    setIsSettingsPanelOpen((prev) => !prev);
  };

  const handleSettingsPanelClose = () => {
    setIsSettingsPanelOpen(false);
  };

  return (
    <DashboardLayout
      activeMenuItem={pageMetadata.activeMenuItem}
      headerTitle={pageMetadata.title}
      isSettingsPanelOpen={isSettingsPanelOpen}
      isSidebarOpen={isSidebarOpen}
      onMenuItemClick={handleMenuItemClick}
      onSettingsPanelClose={handleSettingsPanelClose}
      onToggleSettingsPanel={toggleSettingsPanel}
      onToggleSidebar={toggleSidebar}
    >
      {children}
    </DashboardLayout>
  );
}
