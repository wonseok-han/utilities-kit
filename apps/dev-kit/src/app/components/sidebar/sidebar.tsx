'use client';

import IconLogo from '@assets/icons/icon-logo.svg';
import { useIsMobile } from '@hooks/use-media-query';
import { useSidebarStore } from '@store/sidebar-store';
import { getCurrentPageInfo } from '@utils/menu';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

import { DesktopSidebar } from './desktop-sidebar';
import { MobileSidebar } from './mobile-sidebar';

interface PageMetadata {
  title: string;
  activeMenuItem: string;
}

// 경로별 메타데이터를 자동으로 생성하는 함수
const getPageMetadata = (pathname: string): PageMetadata => {
  const pageInfo = getCurrentPageInfo(pathname);
  return {
    title: pageInfo.title,
    activeMenuItem: pageInfo.activeMenuItem,
  };
};

interface SidebarProps {
  isOpen: boolean;
  onItemClick: (item: string) => void;
  onToggle: () => void;
}

export const Sidebar = memo(function Sidebar({
  isOpen,
  onItemClick,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const pageMetadata = getPageMetadata(pathname);
  const { hasHydrated } = useSidebarStore();

  const isMobile = useIsMobile();

  // hydration 전에는 아무것도 렌더링하지 않음 (깜빡임 방지)
  if (!hasHydrated || isMobile === undefined || isMobile === null) {
    return null;
  }

  const Title = (
    <div className="relative flex items-center space-x-2 ml-2 mt-2">
      <IconLogo />
      <span
        className={`absolute left-12 whitespace-nowrap transition-all duration-300 overflow-hidden ${
          isOpen || isMobile
            ? 'opacity-100 transform scale-x-100 delay-100'
            : 'opacity-0 transform scale-x-0 origin-left pointer-events-none'
        }`}
      >
        Dev Kit
      </span>
    </div>
  );

  // 모바일 환경에서는 MobileSidebar 렌더링
  if (isMobile) {
    return (
      <MobileSidebar
        activeItem={pageMetadata.activeMenuItem}
        isOpen={isOpen}
        onItemClick={onItemClick}
        onToggle={onToggle}
        title={Title}
      />
    );
  }

  // 데스크톱 환경에서는 DesktopSidebar 렌더링
  return (
    <DesktopSidebar
      activeItem={pageMetadata.activeMenuItem}
      isOpen={isOpen}
      onItemClick={onItemClick}
      onToggle={onToggle}
      title={Title}
    />
  );
});
