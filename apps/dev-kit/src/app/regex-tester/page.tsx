import { PageWrapper } from '@components';

import { RegexTesterClient, RegexTesterHeader } from './components';

/**
 * Regex Tester 페이지 - 서버사이드 렌더링
 *
 * 서버에서 정적 콘텐츠를 렌더링하고,
 * 동적 데이터는 클라이언트 컴포넌트에서 처리합니다.
 *
 * 이 페이지는 서버에서 초기 데이터를 준비하여 클라이언트 컴포넌트에 전달하여
 * SEO 최적화와 초기 로딩 성능을 모두 확보합니다.
 */
export default async function RegexTesterPage() {
  // ===== 서버에서 초기 데이터 준비 =====
  const initialData = {
    pattern: '',
    flags: '',
    testString: '',
    matches: null,
    error: null,
    samplePatterns: [
      {
        id: 1,
        label: '이메일',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        flags: 'gm',
        description: '이메일 주소 형식 검증',
      },
      {
        id: 2,
        label: '전화번호',
        pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
        flags: 'gm',
        description: '한국 휴대폰 번호 형식',
      },
      {
        id: 3,
        label: 'URL',
        pattern:
          '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:\\/~\\+#]*[\\w\\-\\@?^=%&\\/~\\+#])?$',
        flags: 'gm',
        description: 'HTTP/HTTPS URL 형식',
      },
      {
        id: 4,
        label: '한글만',
        pattern: '^[가-힣]+$',
        flags: 'gm',
        description: '한글 문자만 허용',
      },
      {
        id: 5,
        label: '숫자만',
        pattern: '^[0-9]+$',
        flags: 'gm',
        description: '숫자만 허용',
      },
      {
        id: 6,
        label: '영문+숫자',
        pattern: '^[a-zA-Z0-9]+$',
        flags: 'gm',
        description: '영문자와 숫자만 허용',
      },
      {
        id: 7,
        label: '한글 포함',
        pattern: '[가-힣]+',
        flags: 'g',
        description: '한글이 포함된 부분 찾기',
      },
      {
        id: 8,
        label: '영문 단어',
        pattern: '\\b[a-zA-Z]+\\b',
        flags: 'g',
        description: '영문 단어 경계 찾기',
      },
    ],
    sampleTestStrings: [
      {
        id: 1,
        label: '이메일 목록',
        text: 'test@example.com\nuser123@gmail.com\ninvalid-email\nadmin@company.co.kr',
      },
      {
        id: 2,
        label: '전화번호 목록',
        text: '010-1234-5678\n01012345678\n02-123-4567\n010-123-456',
      },
      {
        id: 3,
        label: 'URL 목록',
        text: 'https://example.com\nhttp://test.co.kr\ninvalid-url\nhttps://api.example.com/v1/users',
      },
      {
        id: 4,
        label: '한글 텍스트',
        text: '안녕하세요\nHello World\n한글과 영문\n123 숫자',
      },
    ],
  };

  return (
    <PageWrapper>
      {/* ===== 서버에서 렌더링되는 정적 콘텐츠 ===== */}
      <RegexTesterHeader />

      {/* ===== 클라이언트에서 처리되는 동적 콘텐츠 ===== */}
      <RegexTesterClient initialData={initialData} />
    </PageWrapper>
  );
}
