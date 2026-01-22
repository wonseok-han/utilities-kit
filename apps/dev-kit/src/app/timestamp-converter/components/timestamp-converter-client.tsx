'use client';

import type { Dayjs } from '@repo/shared/date';

import {
  formatDate,
  getRelative,
  parseDateWithType,
  type ParsedDateType,
} from '@repo/shared/date';
import { ActionButton, CodeTextarea, useSnackbar } from '@repo/ui';
import { useTimestampConverterStore } from '@store/timestamp-converter-store';
import { useEffect, useState } from 'react';

// ===== 샘플 데이터 정의 =====
const TIMEZONES = [
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
];

const FORMATS = [
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss', icon: '' },
  { label: 'ISO 8601', value: 'YYYY-MM-DDTHH:mm:ssZ', icon: '' },
  { label: 'Unix Timestamp(초)', value: 'X', icon: '' },
  { label: 'Unix Timestamp(밀리초)', value: 'x', icon: '' },
];

const SAMPLE_DATA = [
  { label: '날짜/시간', value: '2025-07-15 13:24:08' },
  { label: 'Timestamp(초)', value: '1752585848' },
  { label: 'Timestamp(밀리초)', value: '1752585848000' },
  { label: 'ISO 8601', value: '2025-07-15T13:24:08Z' },
];

// ===== 상대적 시간 한글 표기 변환 함수 =====
function toKoreanRelative(str: string) {
  return str
    .replace('a few seconds ago', '몇 초 전')
    .replace('a minute ago', '1분 전')
    .replace('minutes ago', '분 전')
    .replace('an hour ago', '1시간 전')
    .replace('hours ago', '시간 전')
    .replace('a day ago', '1일 전')
    .replace('days ago', '일 전')
    .replace('in a few seconds', '몇 초 후')
    .replace('in a minute', '1분 후')
    .replace('in minutes', '분 후')
    .replace('in an hour', '1시간 후')
    .replace('in hours', '시간 후')
    .replace('in a day', '1일 후')
    .replace('in days', '일 후');
}

// ===== 배지 컴포넌트 =====
function Badge({
  children,
  onClick,
  selected,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer min-w-fit
        ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-blue-900 hover:text-white'}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

/**
 * Timestamp Converter 클라이언트 컴포넌트
 *
 * 클라이언트에서 처리되는 모든 동적 로직을 담당합니다:
 * - 상태 관리 (Zustand store)
 * - 타임스탬프 변환 및 파싱
 * - 사용자 인터랙션 처리
 * - 에러 처리
 * - 타임존 및 포맷 필터링
 */
export function TimestampConverterClient() {
  // ===== zustand store 사용 =====
  const {
    clearAll,
    input,
    selectedFormats,
    selectedTimezones,
    setInput,
    setSelectedFormats,
    setSelectedTimezones,
  } = useTimestampConverterStore();
  const [parsed, setParsed] = useState<Dayjs | null>(null);
  const [inputType, setInputType] = useState<ParsedDateType>('invalid');
  const [error, setError] = useState<string | null>(null);

  // ===== 스낵바 훅 사용 =====
  const { showSnackbar } = useSnackbar();

  // ===== 에러 처리 =====
  useEffect(() => {
    if (error) {
      showSnackbar({
        message: error,
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 6000,
      });
    }
  }, [error, showSnackbar]);

  // ===== 타임존 전체 선택/해제 =====
  const isAllTimezonesSelected = selectedTimezones.length === TIMEZONES.length;
  const handleTimezoneAll = () => {
    setSelectedTimezones(
      isAllTimezonesSelected ? [] : TIMEZONES.map((t) => t.value)
    );
  };
  const handleTimezoneToggle = (value: string) => {
    setSelectedTimezones(
      selectedTimezones.includes(value)
        ? selectedTimezones.filter((v) => v !== value)
        : [...selectedTimezones, value]
    );
  };

  // ===== 포맷 전체 선택/해제 =====
  const isAllFormatsSelected = selectedFormats.length === FORMATS.length;
  const handleFormatAll = () => {
    setSelectedFormats(isAllFormatsSelected ? [] : FORMATS.map((f) => f.value));
  };
  const handleFormatToggle = (value: string) => {
    setSelectedFormats(
      selectedFormats.includes(value)
        ? selectedFormats.filter((v) => v !== value)
        : [...selectedFormats, value]
    );
  };

  // ===== 입력값 타입 자동 감지 및 파싱 =====
  const handleInputChange = (v: string) => {
    setInput(v);
  };

  // ===== 현재 시각 입력 =====
  const handleNow = () => {
    const now = parseDateWithType(Date.now().toString());
    setInput(Date.now().toString());
    setParsed(now.date);
    setInputType(now.type);
    setError(null);
  };

  // ===== 입력값, 결과 모두 초기화 =====
  const handleReset = () => {
    clearAll();
    setParsed(null);
    setInputType('invalid');
    setError(null);
  };

  const parseAndSet = (v: string) => {
    if (v.trim() === '') {
      setParsed(null);
      setInputType('invalid');
      setError(null);
      return;
    }
    const { date: parsedDate, type } = parseDateWithType(v);
    setInputType(type);
    if (!parsedDate.isValid()) {
      setParsed(null);
      setError('유효한 timestamp(초/밀리초) 또는 날짜/시간을 입력하세요.');
    } else {
      setParsed(parsedDate);
      setError(null);
    }
  };

  useEffect(() => {
    parseAndSet(input);
  }, [input]);

  return (
    <>
      {/* ===== 상단 버튼 영역 ===== */}
      <div className="flex justify-start space-x-2 mb-4">
        <ActionButton
          feedbackText="입력됨"
          onClick={handleNow}
          variant="primary"
        >
          현재 시간 입력
        </ActionButton>
        <ActionButton
          feedbackText="초기화 완료"
          onClick={handleReset}
          variant="danger"
        >
          초기화
        </ActionButton>
      </div>

      {/* ===== 입력 영역 ===== */}
      <div className="flex flex-col md:flex-row gap-2 items-stretch mb-4">
        <CodeTextarea
          className="flex-1 min-w-0"
          onChange={handleInputChange}
          placeholder="timestamp(초/밀리초) 또는 날짜/시간을 입력하세요"
          value={input}
        />
      </div>

      {/* ===== 샘플 데이터 ===== */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2">
          샘플 입력{' '}
          <span className="text-xs text-blue-400">
            (버튼을 누르면 자동 입력)
          </span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_DATA.map((sample) => (
            <ActionButton
              key={sample.label}
              feedbackText="로드 완료"
              onClick={() => handleInputChange(sample.value)}
              variant="secondary"
            >
              {sample.label}
            </ActionButton>
          ))}
        </div>
      </div>

      {/* ===== 타임존/포맷 선택: 라벨+전체, 배지는 wrap, 간격 축소 ===== */}
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-400 text-xs min-w-fit">타임존 필터:</span>
          <Badge onClick={handleTimezoneAll} selected={isAllTimezonesSelected}>
            전체
          </Badge>
          <div className="flex gap-1 flex-wrap">
            {TIMEZONES.map((tz) => (
              <Badge
                key={tz.value}
                onClick={() => handleTimezoneToggle(tz.value)}
                selected={selectedTimezones.includes(tz.value)}
              >
                {tz.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-gray-400 text-xs min-w-fit">포맷 필터:</span>
          <Badge onClick={handleFormatAll} selected={isAllFormatsSelected}>
            전체
          </Badge>
          <div className="flex gap-1 flex-wrap">
            {FORMATS.map((fmt) => (
              <Badge
                key={fmt.value}
                onClick={() => handleFormatToggle(fmt.value)}
                selected={selectedFormats.includes(fmt.value)}
              >
                {fmt.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {!error && (
        <>
          {/* ===== 결과 영역: 카드+테이블 스타일, 시인성 강화 ===== */}
          {parsed && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* ===== 타임존별 변환 ===== */}
              <div className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-md p-4 mb-2">
                <div className="text-base font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <span>🌐</span> 타임존별 변환
                </div>
                <div className="divide-y divide-gray-700">
                  {TIMEZONES.filter((tz) =>
                    selectedTimezones.includes(tz.value)
                  ).map((tz) => (
                    <div
                      key={tz.value}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition"
                    >
                      <span className="text-gray-400 font-medium min-w-[60px] flex flex-col justify-center gap-1 h-12">
                        {tz.icon} {tz.label}
                        <span className="text-gray-500 text-sm">
                          {`(${tz.value})`}
                        </span>
                      </span>
                      <span className="font-mono text-sm text-white flex-1 text-right">
                        {formatDate(
                          parsed,
                          'YYYY-MM-DD HH:mm:ss',
                          tz.value
                        ) || <span className="text-gray-500">-</span>}
                      </span>
                    </div>
                  ))}
                  {selectedTimezones.length === 0 && (
                    <div className="text-gray-500 text-sm px-3 py-2">
                      표시할 타임존이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* ===== 포맷별 변환 ===== */}
              <div className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-md p-4 mb-2">
                <div className="text-base font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <span>🕒</span> 포맷별 변환
                </div>
                <div className="divide-y divide-gray-700">
                  {FORMATS.filter((fmt) =>
                    selectedFormats.includes(fmt.value)
                  ).map((fmt) => {
                    let value = '-';
                    if (parsed?.isValid()) {
                      if (fmt.value === 'X') {
                        if (inputType === 'timestamp_sec') {
                          value = input;
                        } else if (inputType === 'timestamp_ms') {
                          value = String(Math.floor(parsed.valueOf() / 1000));
                        } else if (inputType === 'date') {
                          value = String(parsed.unix());
                        }
                      } else if (fmt.value === 'x') {
                        if (inputType === 'timestamp_ms') {
                          value = input;
                        } else if (inputType === 'timestamp_sec') {
                          value = String(parsed.valueOf());
                        } else if (inputType === 'date') {
                          value = String(parsed.valueOf());
                        }
                      } else {
                        value = formatDate(parsed, fmt.value);
                      }
                    }
                    return (
                      <div
                        key={fmt.value}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition"
                      >
                        <span className="text-gray-400 font-medium min-w-[60px] flex flex-col justify-center gap-1 h-12">
                          {fmt.icon} {fmt.label}
                        </span>
                        <span
                          className={`font-mono text-sm flex-1 text-right ${value && value !== '-' ? 'text-white' : 'text-gray-500'}`}
                        >
                          {value || '-'}
                        </span>
                      </div>
                    );
                  })}
                  {selectedFormats.length === 0 && (
                    <div className="text-gray-500 text-sm px-3 py-2">
                      표시할 포맷이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== 상대적 시간: 결과 박스와 통일된 스타일 ===== */}
          {parsed && (
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-md p-4 flex items-center gap-4 mb-4">
              <h3 className="text-base font-bold text-blue-400 mr-4 flex items-center gap-2">
                ⏳ 지금으로부터
              </h3>
              <span className="font-mono text-lg text-white flex-1">
                {toKoreanRelative(getRelative(parsed))}
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
