/**
 * JWT Encoder/Decoder 헤더 컴포넌트
 *
 * 서버에서 렌더링되는 정적 콘텐츠로,
 * SEO 최적화를 위해 서버 컴포넌트로 구현합니다.
 */
export function JwtEncoderHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        JWT Encoder/Decoder
      </h1>
      <p className="text-gray-400">
        JWT 토큰을 생성하거나 디코딩하여 Header와 Payload를 확인해보세요.
      </p>
    </div>
  );
}
