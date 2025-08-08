'use client';

import { CVECard } from '@app/cve-viewer/components/cve-card';
import { ToolCard } from '@repo/ui';
import { ActionButton } from '@repo/ui';
import { fetchRecentCVEs } from '@services/cve';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const toolCards = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'JSON 데이터를 예쁘게 포맷하고 검증하세요',
    color: 'blue' as const,
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'base64-encoder',
    title: 'Base64 Encoder',
    description: '텍스트와 파일을 Base64로 인코딩/디코딩',
    color: 'green' as const,
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'jwt-encoder',
    title: 'JWT Encoder',
    description: 'JWT 토큰을 생성하고 디코딩하여 분석하세요',
    color: 'red' as const,
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: '정규식 패턴을 테스트하고 매치 결과를 확인하세요',
    color: 'purple' as const,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          d="M9.75 3v5.25m4.5-5.25v5.25m-7.5 0h10.5M4.5 8.25h15m-1.5 0v7.636a2.25 2.25 0 01-.659 1.591l-2.25 2.25a2.25 2.25 0 01-1.591.659h-2.5a2.25 2.25 0 01-1.591-.659l-2.25-2.25A2.25 2.25 0 015 15.886V8.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'diff',
    title: 'Diff Comparator',
    description: '두 텍스트의 차이점을 한눈에 비교하세요',
    color: 'indigo' as const,
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M5 13l4 4L19 7M5 7h6M13 17h6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'web-editor',
    title: 'Web Editor',
    description: 'WYSIWYG 에디터로 손쉽게 문서를 작성하세요',
    color: 'emerald' as const,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-9.193 9.193a2 2 0 01-.707.464l-4.11 1.37a.5.5 0 01-.632-.632l1.37-4.11a2 2 0 01.464-.707l9.193-9.193zm2.121-2.121a4.25 4.25 0 00-6.01 0l-9.193 9.193a4 4 0 00-.928 1.414l-1.37 4.11A2.5 2.5 0 003.5 21.5l4.11-1.37a4 4 0 001.414-.928l9.193-9.193a4.25 4.25 0 000-6.01z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'cve-viewer',
    title: 'CVE Viewer',
    description: '최신 보안 취약점 정보를 확인하세요',
    color: 'orange' as const,
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

interface DashboardContentProps {
  initialCVEs?: CVEDataType[];
  metadata: PaginationType;
}

export function DashboardContent({
  initialCVEs = [],
  metadata,
}: DashboardContentProps) {
  const router = useRouter();
  const [cves, setCves] = useState<CVEDataType[]>(initialCVEs);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // CVE 데이터 로드
  useEffect(() => {
    // 초기 메타데이터를 기반으로 최신순 데이터 조회
    if (metadata) {
      loadRecentCVEs();
    } else if (initialCVEs.length > 0) {
      // 서버에서 가져온 데이터가 있으면 스토어에 설정
      setCves(initialCVEs);
    }
  }, [initialCVEs, metadata]);

  const loadRecentCVEs = async () => {
    setIsLoading(true);
    try {
      const totalPages = Math.ceil((metadata.totalResults || 1) / 10);
      const result = await fetchRecentCVEs(totalPages, 10); // 최신 10개만
      setCves(result.cves);
    } catch (error) {
      console.error('Failed to load recent CVEs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolCardClick = (tool: string) => {
    router.push(`/${tool}`);
  };

  const handleViewMoreCVEs = () => {
    router.push('/cve-viewer');
  };

  // 자동 슬라이드 전환 (반응형에 따라 슬라이드 수 조정)
  useEffect(() => {
    const getSlidesPerView = () => {
      if (window.innerWidth < 1024) return 1; // lg 미만: 1개 (basis-full)
      if (window.innerWidth < 1280) return 2; // xl 미만: 2개 (lg:basis-1/2)
      return 3; // xl 이상: 3개 (xl:basis-1/3)
    };

    const interval = setInterval(() => {
      const slidesPerView = getSlidesPerView();
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(toolCards.length / slidesPerView)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [toolCards.length]);

  return (
    <div className="flex flex-col h-full">
      {/* 메인 웰컴 섹션 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-normal text-blue-400 mb-4">
            Welcome to Dev Kit
          </h1>
          <p className="text-gray-400 text-lg">
            개발자를 위한 필수 도구들을 한 곳에서!!
          </p>
        </div>

        {/* 도구 카드 캐러셀 */}
        <div className="w-full mx-auto mb-8">
          <div
            aria-roledescription="carousel"
            className="relative min-w-full mx-auto rounded-lg overflow-hidden max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl"
            role="region"
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {toolCards.map((tool) => (
                <div
                  key={tool.id}
                  aria-roledescription="slide"
                  className="min-w-0 shrink-0 grow-0 basis-full pl-1 lg:basis-1/2 xl:basis-1/3"
                  role="group"
                >
                  <div className="p-1">
                    <ToolCard
                      color={tool.color}
                      description={tool.description}
                      icon={tool.icon}
                      onClick={() => handleToolCardClick(tool.id)}
                      title={tool.title}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 인디케이터 */}
            <div className="flex justify-center mt-4 space-x-2">
              {(() => {
                const getSlidesPerView = () => {
                  if (window.innerWidth < 1024) return 1; // lg 미만: 1개
                  if (window.innerWidth < 1280) return 2; // xl 미만: 2개
                  return 3; // xl 이상: 3개
                };
                const slidesPerView = getSlidesPerView();
                return Array.from(
                  { length: Math.ceil(toolCards.length / slidesPerView) },
                  (_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-blue-400' : 'bg-gray-600'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  )
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* 최신 CVE 섹션 */}
      <div className="p-8 border-t border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-300">
            최신 CVE 보안 취약점
          </h3>
          <ActionButton onClick={handleViewMoreCVEs} variant="secondary">
            더보기
          </ActionButton>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-700 rounded mb-4" />
                <div className="h-3 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : cves.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cves.slice(0, 6).map((cve) => (
              <CVECard
                key={`${cve.id}-${cve.publishedDate}-${cve.lastModifiedDate || Date.now()}`}
                cve={cve}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">최신 CVE 데이터를 불러오는 중...</p>
          </div>
        )}
      </div>
    </div>
  );
}
