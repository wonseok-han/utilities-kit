import type { PropsWithChildren } from 'react';

import { DashboardLayout } from '@components/dashboard-layout';

export default function Template({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
