'use client';

import type { PropsWithChildren } from 'react';

import { DashboardLayout } from '@repo/ui';
import { useRouter, usePathname } from 'next/navigation';

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

  const handleMenuItemClick = (item: string) => {
    if (item === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${item}`);
    }
  };

  const handleSettingsPanelClose = () => {
    console.log('Settings panel closed');
  };

  return (
    <DashboardLayout
      activeMenuItem={pageMetadata.activeMenuItem}
      headerTitle={pageMetadata.title}
      onMenuItemClick={handleMenuItemClick}
      onSettingsPanelClose={handleSettingsPanelClose}
    >
      {children}
    </DashboardLayout>
  );
}
