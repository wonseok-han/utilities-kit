import { DashboardContent } from '@components/dashboard-content';
import { fetchRecentCVEs } from '@services/cve';

export default async function Home() {
  // 서버 사이드에서 최신 CVE 데이터 가져오기
  const result = await fetchRecentCVEs(1, 6).catch(() => ({
    cves: [],
    pagination: { hasMore: false },
  }));
  const initialCVEs = result.cves;

  return <DashboardContent initialCVEs={initialCVEs} />;
}
