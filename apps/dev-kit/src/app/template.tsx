import type { PropsWithChildren } from 'react';

import { DashboardProvider } from './components/dashboard-provider';

export default function Template({ children }: PropsWithChildren) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
