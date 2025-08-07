import { PageWrapper } from '@components';

import { JwtEncoderClient, JwtEncoderHeader } from './components';

/**
 * JWT Encoder/Decoder 페이지 - 서버사이드 렌더링
 *
 * 서버에서 정적 콘텐츠를 렌더링하고,
 * 동적 데이터는 클라이언트 컴포넌트에서 처리합니다.
 *
 * 이 페이지는 서버에서 초기 데이터를 준비하여 클라이언트 컴포넌트에 전달하여
 * SEO 최적화와 초기 로딩 성능을 모두 확보합니다.
 */
export default async function JwtEncoderPage() {
  // ===== 서버에서 초기 데이터 준비 =====
  const initialData = {
    mode: 'encode' as const,
    input: '',
    headerInput: '',
    payloadInput: '',
    encodeOutput: '',
    decodeOutput: '',
    error: null,
    sampleData: [
      {
        id: 1,
        label: '기본 JWT',
        header: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
        payload:
          '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.c2lnbmF0dXJl',
      },
      {
        id: 2,
        label: '사용자 정보',
        header: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
        payload:
          '{\n  "userId": 123,\n  "username": "홍길동",\n  "role": "admin",\n  "exp": 1735689600\n}',
        jwt: '',
      },
      {
        id: 3,
        label: '권한 정보',
        header: '{\n  "alg": "RS256",\n  "typ": "JWT",\n  "kid": "key-id-1"\n}',
        payload:
          '{\n  "iss": "https://auth.example.com",\n  "aud": "api.example.com",\n  "scope": ["read", "write"],\n  "exp": 1735689600\n}',
        jwt: '',
      },
    ],
  };

  return (
    <PageWrapper>
      {/* ===== 서버에서 렌더링되는 정적 콘텐츠 ===== */}
      <JwtEncoderHeader />

      {/* ===== 클라이언트에서 처리되는 동적 콘텐츠 ===== */}
      <JwtEncoderClient initialData={initialData} />
    </PageWrapper>
  );
}
