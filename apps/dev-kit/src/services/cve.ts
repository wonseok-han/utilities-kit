import { apiFetch, createApiUrl } from '@utils/api-client';

/**
 * 최근 CVE 데이터를 가져옵니다
 * @param page - 페이지 번호 (1부터 시작, 기본값: 1)
 * @param limit - 페이지당 결과 수 (기본값: 20)
 * @returns CVE 데이터와 페이지네이션 정보
 */
export async function fetchRecentCVEs(
  page = 1,
  limit = 20
): Promise<{
  cves: CVEDataType[];
  pagination: {
    currentPage: number;
    totalResults: number;
    resultsPerPage: number;
    hasMore: boolean;
  };
}> {
  const url = createApiUrl('/api/cve', {
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await apiFetch(url);
  return response.json();
}

/**
 * 특정 CVE ID로 CVE 데이터를 가져옵니다
 */
export async function fetchCVEById(id: string): Promise<CVEDataType | null> {
  const url = createApiUrl(`/api/cve/${id}`);
  const response = await apiFetch(url);
  return response.json();
}
