'use client';

import type { PropsWithChildren } from 'react';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { DashboardLayout } from './dashboard-layout';

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
    case '/jwt-encoder':
      return { title: 'JWT 인코더', activeMenuItem: 'jwt-encoder' };
    case '/json-formatter':
      return { title: 'JSON 포맷터', activeMenuItem: 'json-formatter' };
    case '/regex-tester':
      return { title: '정규식 테스터', activeMenuItem: 'regex-tester' };
    case '/timestamp-converter':
      return { title: 'Timestamp 변환', activeMenuItem: 'timestamp-converter' };
    default:
      return { title: 'Dashboard', activeMenuItem: 'dashboard' };
  }
};

// 모바일 브레이크포인트
const MOBILE_BREAKPOINT = 768;

export function DashboardProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const pageMetadata = getPageMetadata(pathname);

  // 사이드바와 설정패널 토글 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지 및 사이드바 자동 토글
  useEffect(() => {
    const handleResize = () => {
      const isNewMobile = window.innerWidth < MOBILE_BREAKPOINT;

      if (isNewMobile !== isMobile) {
        if (isNewMobile) {
          // 모바일로 변경될 때: 사이드바가 열려있다면 닫기
          if (isSidebarOpen) {
            setIsSidebarOpen(false);
          }
        } else if (!isSidebarOpen) {
          // 데스크톱으로 변경될 때: 사이드바가 닫혀있다면 열기
          setIsSidebarOpen(true);
        }
        setIsMobile(isNewMobile);
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, isSidebarOpen]);

  const handleMenuItemClick = (item: string) => {
    if (item === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${item}`);
    }

    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    if (isMobile) {
      setIsSidebarOpen(false);
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
      isMobile={isMobile}
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
