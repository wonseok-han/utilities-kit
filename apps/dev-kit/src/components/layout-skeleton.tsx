// 스켈레톤 key용 더미 배열
const SIDEBAR_SKELETON_KEYS = [
  'menu1',
  'menu2',
  'menu3',
  'menu4',
  'menu5',
  'menu6',
];

export function LayoutSkeleton() {
  return (
    <div className="flex h-[100dvh] bg-surface text-on-surface fixed inset-0">
      {/* 사이드바 스켈레톤 */}
      <div className="w-64 bg-surface p-4 flex flex-col gap-4 animate-pulse">
        <div className="h-10 bg-surface-skeleton rounded mb-6" />
        <div className="flex-1 flex flex-col gap-3">
          {SIDEBAR_SKELETON_KEYS.map((key) => (
            <div key={key} className="h-8 bg-surface-skeleton rounded" />
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* 헤더 스켈레톤 */}
        <div className="h-10 bg-surface flex items-center px-6 animate-pulse">
          <div className="flex-1" />
          <div className="w-6 h-6 bg-surface-skeleton rounded-full" />
        </div>

        {/* 메인 영역 스켈레톤 */}
        <main className="flex-1 overflow-auto p-2 mx-2 mb-2 bg-surface-deep rounded-t-2xl min-h-0 flex flex-col items-center justify-center animate-pulse">
          <div className="w-full max-w-2xl h-8 bg-surface-elevated rounded mb-6" />
          <div className="w-full max-w-2xl h-48 bg-surface-elevated rounded mb-4" />
          <div className="w-full max-w-2xl h-4 bg-surface-elevated rounded mb-2" />
          <div className="w-full max-w-2xl h-4 bg-surface-elevated rounded mb-2" />
          <div className="w-full max-w-2xl h-4 bg-surface-elevated rounded mb-2" />
        </main>
      </div>
    </div>
  );
}
