import { PageWrapper } from '@components';

import { JsonFormatterClient, JsonFormatterHeader } from './components';

/**
 * JSON Formatter 페이지 - 서버사이드 렌더링
 *
 * 서버에서 정적 콘텐츠를 렌더링하고,
 * 동적 데이터는 클라이언트 컴포넌트에서 처리합니다.
 *
 * 이 페이지는 서버에서 초기 데이터를 준비하여 클라이언트 컴포넌트에 전달하여
 * SEO 최적화와 초기 로딩 성능을 모두 확보합니다.
 */
export default async function JsonFormatterPage() {
  // ===== 서버에서 초기 데이터 준비 =====
  const initialData = {
    input: '',
    output: '',
    error: null,
    sampleData: [
      {
        label: '간단한 객체',
        data: '{"name":"John","age":30,"city":"New York"}',
      },
      {
        label: '배열 데이터',
        data: '[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]',
      },
      {
        label: '중첩 객체',
        data: '{"users":[{"id":1,"profile":{"name":"John","settings":{"theme":"dark","notifications":true}}}]}',
      },
    ],
  };

  return (
    <PageWrapper>
      {/* ===== 서버에서 렌더링되는 정적 콘텐츠 ===== */}
      <JsonFormatterHeader />

      {/* ===== 클라이언트에서 처리되는 동적 콘텐츠 ===== */}
      <JsonFormatterClient initialData={initialData} />
    </PageWrapper>
  );
}
