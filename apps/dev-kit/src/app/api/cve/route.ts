import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

/**
 * 최근 CVE 데이터를 가져오는 API Route
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cveId = searchParams.get('cveId');

    let url: string;

    if (cveId) {
      // 특정 CVE ID로 검색
      url = `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`;
    } else {
      // 최근 CVE 목록 가져오기
      const params = new URLSearchParams({
        resultsPerPage: '20',
        startIndex: '0',
        pubStartDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 최근 7일
        pubEndDate: new Date().toISOString(),
      });
      url = `https://services.nvd.nist.gov/rest/json/cves/2.0?${params}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `NVD API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: NVDResponseType = await response.json();

    if (cveId) {
      // 단일 CVE 반환
      if (data.vulnerabilities && data.vulnerabilities.length > 0) {
        const vuln = data.vulnerabilities[0];
        if (vuln) {
          const cve: CVEDataType = {
            id: vuln.cve.id,
            description:
              vuln.cve.descriptions?.find((desc) => desc.lang === 'en')
                ?.value || 'No description available',
            severity:
              vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity ||
              vuln.cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity ||
              'UNKNOWN',
            publishedDate: vuln.cve.published,
            lastModifiedDate: vuln.cve.lastModified,
            cvssScore:
              vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
              vuln.cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore,
            references: vuln.cve.references?.map((ref) => ref.url) || [],
            affectedProducts:
              vuln.cve.configurations?.flatMap(
                (config) =>
                  config.nodes?.flatMap(
                    (node) => node.cpeMatch?.map((cpe) => cpe.criteria) || []
                  ) || []
              ) || [],
          };
          return NextResponse.json(cve);
        }
      }
      return NextResponse.json(null);
    }
    // CVE 목록 반환
    const cves: CVEDataType[] =
      data.vulnerabilities?.map((vuln) => ({
        id: vuln.cve.id,
        description:
          vuln.cve.descriptions?.find((desc) => desc.lang === 'en')?.value ||
          'No description available',
        severity:
          vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity ||
          vuln.cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity ||
          'UNKNOWN',
        publishedDate: vuln.cve.published,
        lastModifiedDate: vuln.cve.lastModified,
        cvssScore:
          vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
          vuln.cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore,
        references: vuln.cve.references?.map((ref) => ref.url) || [],
        affectedProducts:
          vuln.cve.configurations?.flatMap(
            (config) =>
              config.nodes?.flatMap(
                (node) => node.cpeMatch?.map((cpe) => cpe.criteria) || []
              ) || []
          ) || [],
      })) || [];

    return NextResponse.json(cves);
  } catch (error) {
    console.error('CVE API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CVE data' },
      { status: 500 }
    );
  }
}
