'use client';

import { ActionButton, CodeTextarea, Tabs, useSnackbar } from '@repo/ui';
import { useBase64Store } from '@store/base64-store';

// 탭 아이템 정의
const TAB_ITEMS = [
  { id: 'encode', label: '인코딩' },
  { id: 'decode', label: '디코딩' },
];

// 샘플 데이터 정의
const SAMPLE_DATA = [
  {
    id: 1,
    label: '기본 텍스트',
    data: 'Hello World!',
    isBase64: false,
  },
  {
    id: 2,
    label: '한글 텍스트',
    data: '한글 텍스트 테스트',
    isBase64: false,
  },
  {
    id: 3,
    label: 'JSON 데이터',
    data: '{"name":"John","email":"john@example.com"}',
    isBase64: false,
  },
  {
    id: 4,
    label: 'Base64 샘플',
    data: 'SGVsbG8gV29ybGQh',
    isBase64: true,
  },
] as const;

/**
 * Base64 Encoder/Decoder 클라이언트 컴포넌트
 *
 * 클라이언트에서 처리되는 동적 기능을 담당합니다:
 * - 상태 관리 (입력, 출력, 모드)
 * - 사용자 상호작용 (버튼 클릭, 텍스트 입력)
 * - 에러 처리 및 스낵바 표시
 */
export function Base64EncoderClient() {
  const {
    clearAll,
    error,
    input,
    mode,
    output,
    processText,
    setInput,
    setMode,
    swapMode,
  } = useBase64Store();

  // ===== 스낵바 훅 사용 =====
  const { showSnackbar } = useSnackbar();

  /**
   * 출력 결과를 클립보드에 복사합니다
   */
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      showSnackbar({
        message: '클립보드 복사 실패. 다시 시도해주세요.',
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 6000,
      });
    }
  };

  /**
   * 샘플 데이터를 입력 영역에 로드합니다
   * @param data - 로드할 데이터
   * @param isBase64 - Base64 데이터 여부
   */
  const handleSampleLoad = (data: string, isBase64: boolean): void => {
    setInput(data);
    setMode(isBase64 ? 'decode' : 'encode');
  };

  // 모드에 따른 라벨 텍스트
  const getInputLabel = (): string => {
    return mode === 'encode' ? '원본 텍스트' : 'Base64 텍스트';
  };

  const getOutputLabel = (): string => {
    return mode === 'encode' ? 'Base64 텍스트' : '원본 텍스트';
  };

  // 플레이스홀더 텍스트
  const getPlaceholder = (): string => {
    return mode === 'encode' ? 'Hello World!' : 'SGVsbG8gV29ybGQh';
  };

  return (
    <>
      {/* 모드 선택 탭 */}
      <div className="mb-4 flex items-center space-x-4">
        <Tabs
          items={TAB_ITEMS}
          onChange={(value) => setMode(value as 'encode' | 'decode')}
          value={mode}
        />
      </div>

      {/* 메인 작업 영역 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              입력 ({getInputLabel()})
            </label>
            <div className="flex space-x-2">
              <ActionButton
                disabled={!input}
                feedbackText="완료"
                onClick={() => input && processText()}
                variant="primary"
              >
                {mode === 'encode' ? '인코딩' : '디코딩'}
              </ActionButton>
              <ActionButton
                disabled={!output}
                feedbackText="전환 완료"
                onClick={() => output && swapMode()}
                variant="success"
              >
                ↔ 전환
              </ActionButton>
              <ActionButton
                disabled={!input && !output}
                feedbackText="초기화 완료"
                onClick={() => (input || output) && clearAll()}
                variant="danger"
              >
                초기화
              </ActionButton>
            </div>
          </div>
          <CodeTextarea
            aria-label={`${getInputLabel()} 입력`}
            onChange={setInput}
            placeholder={getPlaceholder()}
            value={input}
          />
        </section>

        {/* 출력 영역 */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              출력 ({getOutputLabel()})
            </label>
            {output && (
              <ActionButton
                feedbackText="복사 완료"
                onClick={handleCopy}
                variant="secondary"
              >
                복사
              </ActionButton>
            )}
          </div>
          <div className="flex-1 relative">
            <CodeTextarea
              readOnly
              aria-label={`${getOutputLabel()} 출력`}
              className="h-full w-full"
              value={output}
            />
            {error && (
              <div
                aria-live="polite"
                className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 rounded-lg"
                role="alert"
              >
                <div className="text-red-400 text-center">
                  <div aria-hidden="true" className="mb-2">
                    ❌
                  </div>
                  <div>{error}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 샘플 데이터 섹션 */}
      <section className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
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
              onClick={() => handleSampleLoad(sample.data, sample.isBase64)}
              variant="secondary"
            >
              {sample.label}
            </ActionButton>
          ))}
        </div>
      </section>
    </>
  );
}
