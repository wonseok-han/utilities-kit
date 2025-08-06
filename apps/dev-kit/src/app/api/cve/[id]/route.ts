import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

/**
 * 특정 CVE ID의 상세 정보를 가져오는 API Route
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'CVE ID is required' },
        { status: 400 }
      );
    }

    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `NVD API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: NVDResponseType = await response.json();

    // 단일 CVE 반환
    if (data.vulnerabilities && data.vulnerabilities.length > 0) {
      const vuln = data.vulnerabilities[0];
      if (vuln) {
        const cve: CVEDataType = {
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
        };
        return NextResponse.json(cve);
      }
    }

    return NextResponse.json({ error: 'CVE not found' }, { status: 404 });
  } catch (error) {
    console.error('CVE detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CVE detail' },
      { status: 500 }
    );
  }
}
