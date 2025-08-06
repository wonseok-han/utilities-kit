'use client';

import { ActionButton, CodeTextarea, Tabs } from '@repo/ui';
import { useBase64Store } from '@store/base64-store';

export default function Base64EncoderPage() {
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const tabItems = [
    { id: 'encode', label: '인코딩' },
    { id: 'decode', label: '디코딩' },
  ];

  const sampleData = [
    {
      id: 1,
      label: '기본 텍스트',
      data: 'Hello World!',
    },
    {
      id: 2,
      label: '한글 텍스트',
      data: '한글 텍스트 테스트',
    },
    {
      id: 3,
      label: 'JSON 데이터',
      data: '{"name":"John","email":"john@example.com"}',
    },
    {
      id: 4,
      label: 'Base64 샘플',
      data: 'SGVsbG8gV29ybGQh',
    },
  ];

  return (
    <div className="flex flex-col min-h-fit h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Base64 Encoder/Decoder
        </h1>
        <p className="text-gray-400">
          텍스트를 Base64로 인코딩하거나 Base64를 디코딩해보세요.
        </p>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <Tabs
          items={tabItems}
          onChange={(value) => setMode(value as 'encode' | 'decode')}
          value={mode}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              입력 ({mode === 'encode' ? '원본 텍스트' : 'Base64 텍스트'})
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
            onChange={setInput}
            placeholder={
              mode === 'encode' ? 'Hello World!' : 'SGVsbG8gV29ybGQh'
            }
            value={input}
          />
        </div>

        {/* 출력 영역 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              출력 ({mode === 'encode' ? 'Base64 텍스트' : '원본 텍스트'})
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
          {sampleData.map((sample) => (
            <ActionButton
              key={sample.label}
              feedbackText="로드 완료"
              onClick={() => {
                setInput(sample.data);
                if (sample.id === 4) {
                  setMode('decode');
                } else {
                  setMode('encode');
                }
              }}
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
