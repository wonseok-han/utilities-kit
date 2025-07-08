'use client';

import { useJsonStore } from '@store/json-store';
import { useState } from 'react';

// 피드백 지속 시간 상수
const FEEDBACK_DURATION = 2000;

export default function JsonFormatterPage() {
  const { clearAll, error, formatJson, input, minifyJson, output, setInput } =
    useJsonStore();

  const [isCopied, setIsCopied] = useState(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const [isMinified, setIsMinified] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const handleCopy = async () => {
    if (isCopied) return; // debounce

    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), FEEDBACK_DURATION);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleFormat = () => {
    if (isFormatted) return; // debounce
    if (!input) return;

    formatJson();
    setIsFormatted(true);
    setTimeout(() => setIsFormatted(false), FEEDBACK_DURATION);
  };

  const handleMinify = () => {
    if (isMinified) return; // debounce
    if (!input) return;

    minifyJson();
    setIsMinified(true);
    setTimeout(() => setIsMinified(false), FEEDBACK_DURATION);
  };

  const handleClear = () => {
    if (isCleared) return; // debounce
    if (!input) return;

    clearAll();
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), FEEDBACK_DURATION);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">JSON 포맷터</h1>
        <p className="text-gray-400">
          JSON 데이터를 예쁘게 정렬하거나 최소화해보세요.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              입력 (JSON)
            </label>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-white text-sm rounded transition-all cursor-pointer ${
                  isFormatted
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isFormatted}
                onClick={handleFormat}
              >
                {isFormatted ? '✓ 정렬 완료' : '정렬'}
              </button>
              <button
                className={`px-3 py-1 text-white text-sm rounded transition-all cursor-pointer ${
                  isMinified
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={isMinified}
                onClick={handleMinify}
              >
                {isMinified ? '✓ 압축 완료' : '압축'}
              </button>
              <button
                className={`px-3 py-1 text-white text-sm rounded transition-all cursor-pointer ${
                  isCleared
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={isCleared}
                onClick={handleClear}
              >
                {isCleared ? '✓ 초기화 완료' : '초기화'}
              </button>
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
              <button
                className={`px-3 py-1 text-white text-sm rounded transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                disabled={isCopied}
                onClick={handleCopy}
              >
                {isCopied ? '✓ 복사 완료' : '복사'}
              </button>
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
