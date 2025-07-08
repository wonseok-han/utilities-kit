'use client';

import { ToolCard } from '@repo/ui';
import { useRouter } from 'next/navigation';

export function DashboardContent() {
  const router = useRouter();

  const handleToolCardClick = (tool: string) => {
    router.push(`/${tool}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 메인 웰컴 섹션 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-normal text-blue-400 mb-4">
            Welcome to Dev Tools
          </h1>

          {/* 프롬프트 입력 영역 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <textarea
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="개발에 필요한 도구를 선택하거나 질문을 입력하세요..."
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  Run →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 기능 카드들 */}
      <div className="p-8 border-t border-gray-700">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-300 mb-4">
            What&apos;s new
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard
            color="blue"
            description="JSON 데이터를 예쁘게 포맷하고 검증하세요"
            icon={
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
            }
            onClick={() => handleToolCardClick('json-formatter')}
            title="JSON 포맷터"
          />

          <ToolCard
            color="green"
            description="텍스트와 파일을 Base64로 인코딩/디코딩"
            icon={
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
            }
            onClick={() => handleToolCardClick('base64-encoder')}
            title="Base64 인코더"
          />

          <ToolCard
            color="purple"
            description="URL을 안전하게 인코딩하고 디코딩하세요"
            icon={
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            }
            onClick={() => handleToolCardClick('url-encoder')}
            title="URL 인코더"
          />

          <ToolCard
            color="orange"
            description="색상 코드 변환 및 팔레트 생성 도구"
            icon={
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2zM9 9h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            }
            onClick={() => handleToolCardClick('color-palette')}
            title="색상 팔레트"
          />
        </div>
      </div>
    </div>
  );
}
