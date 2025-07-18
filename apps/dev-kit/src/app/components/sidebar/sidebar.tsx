'use client';

import IconLogo from '@assets/icons/icon-logo.svg';
import { useIsMobile } from '@hooks/use-media-query';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

import { DesktopSidebar } from './desktop-sidebar';
import { MobileSidebar } from './mobile-sidebar';

interface PageMetadata {
  title: string;
  activeMenuItem: string;
}

// 경로별 기본 메타데이터 매핑
const getPageMetadata = (pathname: string): PageMetadata => {
  switch (pathname) {
    case '/':
      return { title: 'Dashboard', activeMenuItem: 'dashboard' };
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

  const isMobile = useIsMobile();

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
