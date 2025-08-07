/**
 * Timestamp Converter 헤더 컴포넌트
 *
 * 서버에서 렌더링되는 정적 콘텐츠로,
 * SEO 최적화를 위해 서버 컴포넌트로 구현합니다.
 */
export function TimestampConverterHeader() {
  return (
    <div className="mb-6">
      <h1 className="mb-2 text-2xl font-bold text-white">
        Timestamp Converter
      </h1>
      <p className="text-gray-400">
        Unix Timestamp(초/밀리초)와 날짜/시간을 상호 변환하고, 다양한 타임존 및
        포맷으로 결과를 확인하세요.
      </p>
    </div>
  );
}
