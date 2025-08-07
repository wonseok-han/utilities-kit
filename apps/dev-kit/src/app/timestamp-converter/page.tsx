import { PageWrapper } from '@components';

import {
  TimestampConverterClient,
  TimestampConverterHeader,
} from './components';

/**
 * Timestamp Converter 페이지 - 서버사이드 렌더링
 *
 * 서버에서 정적 콘텐츠를 렌더링하고,
 * 동적 데이터는 클라이언트 컴포넌트에서 처리합니다.
 *
 * 이 페이지는 서버에서 초기 데이터를 준비하여 클라이언트 컴포넌트에 전달하여
 * SEO 최적화와 초기 로딩 성능을 모두 확보합니다.
 */
export default async function TimestampConverterPage() {
  // ===== 서버에서 초기 데이터 준비 =====
  const initialData = {
    input: '',
    selectedFormats: ['YYYY-MM-DD HH:mm:ss', 'X', 'x'],
    selectedTimezones: ['UTC', 'Asia/Seoul', 'America/New_York'],
    timezones: [
      { label: 'UTC', value: 'UTC', icon: '' },
      { label: 'GMT', value: 'Etc/GMT', icon: '' },
      { label: 'KST', value: 'Asia/Seoul', icon: '' },
      { label: 'JST', value: 'Asia/Tokyo', icon: '' },
      { label: 'CST', value: 'Asia/Shanghai', icon: '' },
      { label: 'EST', value: 'America/New_York', icon: '' },
      { label: 'PST', value: 'America/Los_Angeles', icon: '' },
      { label: 'CET', value: 'Europe/Berlin', icon: '' },
      { label: 'IST', value: 'Asia/Kolkata', icon: '' },
      { label: 'MSK', value: 'Europe/Moscow', icon: '' },
      { label: 'AEDT', value: 'Australia/Sydney', icon: '' },
      { label: 'HKT', value: 'Asia/Hong_Kong', icon: '' },
      { label: 'SGT', value: 'Asia/Singapore', icon: '' },
      { label: 'BRT', value: 'America/Sao_Paulo', icon: '' },
    ],
    formats: [
      { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss', icon: '' },
      { label: 'ISO 8601', value: 'YYYY-MM-DDTHH:mm:ssZ', icon: '' },
      { label: 'Unix Timestamp(초)', value: 'X', icon: '' },
      { label: 'Unix Timestamp(밀리초)', value: 'x', icon: '' },
    ],
    sampleData: [
      { label: '날짜/시간', value: '2025-07-15 13:24:08' },
      { label: 'Timestamp(초)', value: '1752585848' },
      { label: 'Timestamp(밀리초)', value: '1752585848000' },
      { label: 'ISO 8601', value: '2025-07-15T13:24:08Z' },
    ],
  };

  return (
    <PageWrapper>
      {/* ===== 서버에서 렌더링되는 정적 콘텐츠 ===== */}
      <TimestampConverterHeader />

      {/* ===== 클라이언트에서 처리되는 동적 콘텐츠 ===== */}
      <TimestampConverterClient initialData={initialData} />
    </PageWrapper>
  );
}
