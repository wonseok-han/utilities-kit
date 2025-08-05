/**
 * 최근 CVE 데이터를 가져옵니다
 */
export async function fetchRecentCVEs(): Promise<CVEDataType[]> {
  const response = await fetch('/api/cve');

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * 특정 CVE ID로 CVE 데이터를 가져옵니다
 */
export async function fetchCVEById(id: string): Promise<CVEDataType | null> {
  const response = await fetch(`/api/cve?cveId=${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
