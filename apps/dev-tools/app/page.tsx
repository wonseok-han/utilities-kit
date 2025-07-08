'use client';

import { DashboardLayout } from '@repo/ui';
import { useRouter } from 'next/navigation';

import { DashboardContent } from './components/dashboard-content';

export default function Home() {
  const router = useRouter();

  const handleMenuItemClick = (item: string) => {
    if (item === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${item}`);
    }
  };

  return (
    <DashboardLayout
      activeMenuItem="dashboard"
      headerTitle="Dashboard"
      onMenuItemClick={handleMenuItemClick}
      onSettingsPanelClose={() => console.log('Settings panel closed')}
    >
      <DashboardContent />
    </DashboardLayout>
  );
}
