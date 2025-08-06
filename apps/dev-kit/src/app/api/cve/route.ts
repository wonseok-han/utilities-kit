import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

/**
 * CVE 목록을 가져오는 API Route (RESTful)
 * GET /api/cve - CVE 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    // 1-based 페이지를 0-based로 변환
    const page = parseInt(pageParam) - 1;
    const startIndex = page * parseInt(limit);

    // FIXME 에러일 때 테스트
    return NextResponse.json({ error: `NVD API error: 404` }, { status: 404 });

    const params = new URLSearchParams({
      resultsPerPage: limit,
      startIndex: startIndex.toString(),
      pubStartDate: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 최근 7일
      pubEndDate: new Date().toISOString(),
    });

    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `NVD API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: NVDResponseType = await response.json();

    // CVE 목록 반환 (페이지네이션 정보 포함)
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

    const pagination = {
      currentPage: page + 1,
      totalResults: data.totalResults || 0,
      hasMore: (page + 1) * parseInt(limit) < (data.totalResults || 0),
    };

    return NextResponse.json({
      cves,
      pagination,
    });
  } catch (error) {
    console.error('CVE list API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CVE list' },
      { status: 500 }
    );
  }
}
