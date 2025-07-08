'use client';

import { useState } from 'react';

export default function Base64EncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const processText = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
      setError('');
    } catch (_) {
      setError(
        mode === 'encode'
          ? '인코딩에 실패했습니다.'
          : '올바르지 않은 Base64 형식입니다.'
      );
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Base64 인코더/디코더
        </h1>
        <p className="text-gray-400">
          텍스트를 Base64로 인코딩하거나 Base64를 디코딩해보세요.
        </p>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'encode'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setMode('encode')}
          >
            인코딩
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'decode'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setMode('decode')}
          >
            디코딩
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              입력 ({mode === 'encode' ? '원본 텍스트' : 'Base64 텍스트'})
            </label>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                onClick={processText}
              >
                {mode === 'encode' ? '인코딩' : '디코딩'}
              </button>
              <button
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                onClick={swapMode}
              >
                ↔ 전환
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
        <h3 className="text-sm font-medium text-gray-300 mb-2">샘플 데이터</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
            onClick={() => setInput('Hello World!')}
          >
            기본 텍스트
          </button>
          <button
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
            onClick={() => setInput('한글 텍스트 테스트')}
          >
            한글 텍스트
          </button>
          <button
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
            onClick={() =>
              setInput('{"name":"John","email":"john@example.com"}')
            }
          >
            JSON 데이터
          </button>
          <button
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
            onClick={() => setInput('SGVsbG8gV29ybGQh')}
          >
            Base64 샘플
          </button>
        </div>
      </div>
    </div>
  );
}
