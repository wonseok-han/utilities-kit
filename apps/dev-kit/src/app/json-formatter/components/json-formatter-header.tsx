/**
 * JSON Formatter 헤더 컴포넌트
 *
 * 서버에서 렌더링되는 정적 콘텐츠로,
 * SEO 최적화를 위해 서버 컴포넌트로 구현합니다.
 */
export function JsonFormatterHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2">JSON Formatter</h1>
      <p className="text-gray-400">JSON 데이터를 구조화하고 최적화하세요.</p>
    </div>
  );
}
