'use client';

import { ActionButton } from '@repo/ui';
import { useJsonStore } from '@store/json-store';

export default function JsonFormatterPage() {
  const { clearAll, error, formatJson, input, minifyJson, output, setInput } =
    useJsonStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">JSON 포맷터</h1>
        <p className="text-gray-400">JSON 데이터를 구조화하고 최적화하세요.</p>
      </div>

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
          <textarea
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setInput(e.target.value)}
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
            <textarea
              readOnly
              className="w-full h-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none"
              value={output}
            />
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
        <h3 className="text-sm font-medium text-gray-300 mb-2">샘플 데이터</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors cursor-pointer"
            onClick={() =>
              setInput('{"name":"John","age":30,"city":"New York"}')
            }
          >
            간단한 객체
          </button>
          <button
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors cursor-pointer"
            onClick={() =>
              setInput('[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]')
            }
          >
            배열 데이터
          </button>
          <button
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors cursor-pointer"
            onClick={() =>
              setInput(
                '{"users":[{"id":1,"profile":{"name":"John","settings":{"theme":"dark","notifications":true}}}]}'
              )
            }
          >
            중첩 객체
          </button>
        </div>
      </div>
    </div>
  );
}
