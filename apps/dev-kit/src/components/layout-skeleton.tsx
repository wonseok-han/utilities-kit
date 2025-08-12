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
    <div className="flex h-[100dvh] bg-gray-700 text-white fixed inset-0">
      {/* 사이드바 스켈레톤 */}
      <div className="w-64 bg-gray-700 p-4 flex flex-col gap-4 animate-pulse">
        <div className="h-10 bg-gray-600 rounded mb-6" />
        <div className="flex-1 flex flex-col gap-3">
          {SIDEBAR_SKELETON_KEYS.map((key) => (
            <div key={key} className="h-8 bg-gray-600 rounded" />
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* 헤더 스켈레톤 */}
        <div className="h-10 bg-gray-700 flex items-center px-6 animate-pulse">
          <div className="flex-1" />
          <div className="w-6 h-6 bg-gray-600 rounded-full" />
        </div>

        {/* 메인 영역 스켈레톤 */}
        <main className="flex-1 overflow-auto p-2 mx-2 mb-2 bg-gray-900 rounded-t-2xl min-h-0 flex flex-col items-center justify-center animate-pulse">
          <div className="w-full max-w-2xl h-8 bg-gray-700 rounded mb-6" />
          <div className="w-full max-w-2xl h-48 bg-gray-700 rounded mb-4" />
          <div className="w-full max-w-2xl h-4 bg-gray-700 rounded mb-2" />
          <div className="w-full max-w-2xl h-4 bg-gray-700 rounded mb-2" />
          <div className="w-full max-w-2xl h-4 bg-gray-700 rounded mb-2" />
        </main>
      </div>
    </div>
  );
}
