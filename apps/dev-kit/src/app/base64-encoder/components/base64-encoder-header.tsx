/**
 * Base64 Encoder/Decoder 헤더 컴포넌트
 *
 * 서버에서 렌더링되는 정적 콘텐츠로,
 * 페이지 제목과 설명을 담당합니다.
 */
export function Base64EncoderHeader() {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Base64 Encoder/Decoder
      </h1>
      <p className="text-gray-400">
        텍스트를 Base64로 인코딩하거나 Base64를 디코딩해보세요.
      </p>
    </header>
  );
}
