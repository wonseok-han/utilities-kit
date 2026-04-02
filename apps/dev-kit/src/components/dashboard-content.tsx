'use client';

import { ToolCard } from '@repo/ui';
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
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Unix Timestamp와 날짜/시간을 상호 변환하세요',
    color: 'orange' as const,
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

export function DashboardContent() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleToolCardClick = (tool: string) => {
    router.push(`/${tool}`);
  };

  // 자동 슬라이드 전환
  useEffect(() => {
    const getSlidesPerView = () => {
      if (window.innerWidth < 1024) return 1;
      if (window.innerWidth < 1280) return 2;
      return 3;
    };

    const interval = setInterval(() => {
      const slidesPerView = getSlidesPerView();
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(toolCards.length / slidesPerView)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-normal text-accent mb-4">
          Welcome to Dev Kit
        </h1>
        <p className="text-on-surface-muted text-lg">
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
                if (window.innerWidth < 1024) return 1;
                if (window.innerWidth < 1280) return 2;
                return 3;
              };
              const slidesPerView = getSlidesPerView();
              return Array.from(
                { length: Math.ceil(toolCards.length / slidesPerView) },
                (_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide
                        ? 'bg-accent'
                        : 'bg-surface-skeleton'
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
  );
}
