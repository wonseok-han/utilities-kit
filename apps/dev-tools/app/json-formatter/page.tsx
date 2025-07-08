'use client';

import { DashboardLayout } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function JsonFormatterPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleMenuItemClick = (item: string) => {
    if (item === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${item}`);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (_) {
      setError('잘못된 JSON 형식입니다.');
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (_) {
      setError('잘못된 JSON 형식입니다.');
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <DashboardLayout
      activeMenuItem="json-formatter"
      headerTitle="JSON 포맷터"
      onMenuItemClick={handleMenuItemClick}
      onSettingsPanelClose={() => console.log('Settings panel closed')}
    >
      <div className="flex flex-col h-full p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">JSON 포맷터</h1>
          <p className="text-gray-400">
            JSON 데이터를 예쁘게 포맷하거나 압축해보세요.
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
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  onClick={formatJson}
                >
                  포맷
                </button>
                <button
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  onClick={minifyJson}
                >
                  압축
                </button>
                <button
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  onClick={clearAll}
                >
                  지우기
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
                출력 (포맷된 JSON)
              </label>
              {output && (
                <button
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                  onClick={() => navigator.clipboard.writeText(output)}
                >
                  복사
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
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            샘플 데이터
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              onClick={() =>
                setInput('{"name":"John","age":30,"city":"New York"}')
              }
            >
              간단한 객체
            </button>
            <button
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              onClick={() =>
                setInput('[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]')
              }
            >
              배열 데이터
            </button>
            <button
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
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
    </DashboardLayout>
  );
}
