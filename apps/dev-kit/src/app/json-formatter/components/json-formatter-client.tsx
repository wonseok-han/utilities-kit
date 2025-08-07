'use client';

import { ActionButton, CodeTextarea, useSnackbar } from '@repo/ui';
import { useJsonStore } from '@store';

interface JsonFormatterClientProps {
  initialData: {
    input: string;
    output: string;
    error: string | null;
    sampleData: Array<{
      label: string;
      data: string;
    }>;
  };
}

/**
 * JSON Formatter 클라이언트 컴포넌트
 *
 * 클라이언트에서 처리되는 모든 동적 로직을 담당합니다:
 * - 상태 관리 (Zustand store)
 * - JSON 포맷팅 및 압축
 * - 사용자 인터랙션 처리
 * - 에러 처리
 */
export function JsonFormatterClient({ initialData }: JsonFormatterClientProps) {
  const { clearAll, error, formatJson, input, minifyJson, output, setInput } =
    useJsonStore();

  // ===== 스낵바 훅 사용 =====
  const { showSnackbar } = useSnackbar();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error('복사 실패:', err);
      showSnackbar({
        message: '클립보드 복사에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 6000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-fit h-full p-6">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              입력 (JSON)
            </label>
            <div className="flex space-x-2">
              <ActionButton
                disabled={!input}
                feedbackText="정렬 완료"
                onClick={() => input && formatJson()}
                variant="primary"
              >
                정렬
              </ActionButton>
              <ActionButton
                disabled={!input}
                feedbackText="압축 완료"
                onClick={() => input && minifyJson()}
                variant="success"
              >
                압축
              </ActionButton>
              <ActionButton
                disabled={!input}
                feedbackText="초기화 완료"
                onClick={() => input && clearAll()}
                variant="danger"
              >
                초기화
              </ActionButton>
            </div>
          </div>
          <CodeTextarea
            onChange={setInput}
            placeholder='{"name": "John", "age": 30}'
            value={input}
          />
        </div>

        {/* 출력 영역 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              출력 결과
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
            <CodeTextarea readOnly className="h-full w-full" value={output} />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 rounded-lg">
                <div className="text-red-400 text-center">
                  <div className="mb-2">❌</div>
                  <div>{error}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 샘플 데이터 */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-2">
          샘플 입력{' '}
          <span className="text-xs text-blue-400">
            (버튼을 누르면 자동 입력)
          </span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {initialData.sampleData.map((sample) => (
            <ActionButton
              key={sample.label}
              feedbackText="로드 완료"
              onClick={() => setInput(sample.data)}
              variant="secondary"
            >
              {sample.label}
            </ActionButton>
          ))}
        </div>
      </div>
    </div>
  );
}
