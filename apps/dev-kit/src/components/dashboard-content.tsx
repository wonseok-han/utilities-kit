'use client';

import { ToolCard } from '@repo/ui';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const RECENT_TOOLS_KEY = 'dev-kit-recent-tools';
const MAX_RECENT = 3;

interface ToolDef {
  id: string;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'emerald';
  icon: React.ReactNode;
  onboarding: string;
  tags: string[];
}

const tools: ToolDef[] = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'JSON 데이터를 예쁘게 포맷하고 검증하세요',
    color: 'blue',
    onboarding: 'JSON을 정리하거나 검증하고 싶다면?',
    tags: ['포맷', '검증', '압축'],
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
    color: 'green',
    onboarding: '텍스트를 인코딩/디코딩하고 싶다면?',
    tags: ['Base64', '인코딩', '디코딩'],
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
    color: 'red',
    onboarding: 'JWT 토큰을 분석하거나 생성하고 싶다면?',
    tags: ['JWT', 'Header', 'Payload'],
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
    color: 'purple',
    onboarding: '정규식을 테스트하고 싶다면?',
    tags: ['패턴', '매치', '플래그'],
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
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Unix Timestamp와 날짜/시간을 상호 변환하세요',
    color: 'orange',
    onboarding: '타임스탬프를 변환하고 싶다면?',
    tags: ['Unix', '타임존', 'ISO 8601'],
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
  {
    id: 'diff',
    title: 'Diff Comparator',
    description: '두 텍스트의 차이점을 한눈에 비교하세요',
    color: 'indigo',
    onboarding: '두 텍스트를 비교하고 싶다면?',
    tags: ['Diff', 'Side by Side', 'Inline'],
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
    color: 'emerald',
    onboarding: 'HTML 문서를 작성하고 싶다면?',
    tags: ['WYSIWYG', 'HTML', 'Tiptap'],
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
];

const toolsMap = new Map(tools.map((t) => [t.id, t]));

function getRecentToolIds(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_TOOLS_KEY);
    if (!stored) return [];
    const ids = JSON.parse(stored) as string[];
    return ids.filter((id) => toolsMap.has(id));
  } catch {
    return [];
  }
}

function addRecentTool(id: string) {
  const recent = getRecentToolIds().filter((t) => t !== id);
  recent.unshift(id);
  localStorage.setItem(
    RECENT_TOOLS_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  );
}

export function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(getRecentToolIds());
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      setRecentIds(getRecentToolIds());
    }
  }, [pathname]);

  const handleToolClick = useCallback(
    (id: string) => {
      addRecentTool(id);
      setRecentIds(getRecentToolIds());
      router.push(`/${id}`);
    },
    [router]
  );

  const recentTools = recentIds
    .map((id) => toolsMap.get(id))
    .filter(Boolean) as ToolDef[];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Dev Kit</h1>
        <p className="text-on-surface-muted">무엇을 하고 싶으세요?</p>
      </div>

      {/* 최근 사용 */}
      {recentTools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-3">
            최근 사용
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                color={tool.color}
                description={tool.description}
                icon={tool.icon}
                onClick={() => handleToolClick(tool.id)}
                title={tool.title}
              />
            ))}
          </div>
        </section>
      )}

      {/* 온보딩 카드 */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className="group relative flex flex-col justify-between p-6 rounded-2xl border border-border bg-surface-deep hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer text-left min-h-[160px] overflow-hidden"
              onClick={() => handleToolClick(tool.id)}
            >
              {/* 배경 장식 */}
              <div
                className={`absolute -right-4 -top-4 w-24 h-24 bg-${tool.color}-600/10 rounded-full blur-2xl transition-transform duration-300 group-hover:scale-150`}
              />

              {/* 질문 + 설명 */}
              <div className="relative z-10">
                <p className="text-lg font-medium text-on-surface leading-snug">
                  {tool.onboarding}
                </p>
                <p className="text-sm text-on-surface-muted mt-1.5 leading-relaxed">
                  {tool.description}
                </p>
                {/* 태그 */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] rounded-full bg-surface-elevated/60 text-on-surface-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 도구명 + 아이콘 */}
              <div className="flex items-center gap-2.5 mt-5 relative z-10">
                <div
                  className={`w-8 h-8 bg-${tool.color}-600 rounded-lg flex items-center justify-center shrink-0`}
                >
                  {tool.icon}
                </div>
                <span className="text-sm font-semibold text-on-surface-muted group-hover:text-accent transition-colors">
                  {tool.title}
                </span>
                <svg
                  className="w-4 h-4 text-on-surface-muted/0 group-hover:text-accent group-hover:translate-x-1 transition-all ml-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
