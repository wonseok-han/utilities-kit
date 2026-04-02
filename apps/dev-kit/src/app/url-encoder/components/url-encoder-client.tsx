'use client';

import { ActionButton, CodeTextarea, Tabs, useSnackbar } from '@repo/ui';
import { useCallback, useEffect, useState } from 'react';

const TAB_ITEMS = [
  { id: 'encode', label: '인코딩' },
  { id: 'decode', label: '디코딩' },
];

const SAMPLE_DATA = [
  {
    label: 'URL with 한글',
    data: 'https://example.com/search?q=안녕하세요&lang=ko',
    isEncoded: false,
  },
  {
    label: '인코딩된 URL',
    data: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94%26lang%3Dko',
    isEncoded: true,
  },
  {
    label: '쿼리 파라미터',
    data: 'name=%ED%99%8D%EA%B8%B8%EB%8F%99&age=30&city=Seoul&tags=%5B%22dev%22%2C%22web%22%5D',
    isEncoded: true,
  },
];

interface ParsedParam {
  key: string;
  value: string;
}

function parseQueryParams(input: string): ParsedParam[] {
  try {
    // URL에서 쿼리스트링 추출, 또는 직접 쿼리스트링인 경우
    let queryString = input;
    if (input.includes('?')) {
      queryString = input.split('?')[1] || '';
    }
    // &로 시작하면 제거
    queryString = queryString.replace(/^&/, '');
    if (!queryString) return [];

    const params = new URLSearchParams(queryString);
    const result: ParsedParam[] = [];
    params.forEach((value, key) => {
      result.push({ key, value });
    });
    return result;
  } catch {
    return [];
  }
}

export function UrlEncoderClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [parsedParams, setParsedParams] = useState<ParsedParam[]>([]);
  const { showSnackbar } = useSnackbar();

  const process = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setParsedParams([]);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
      setError('');
    } catch {
      setError(
        mode === 'encode'
          ? '인코딩할 수 없는 문자열입니다.'
          : '유효한 인코딩 문자열이 아닙니다.'
      );
      setOutput('');
    }

    // 쿼리 파라미터 파싱 (디코딩 모드에서)
    if (mode === 'decode') {
      setParsedParams(parseQueryParams(input));
    } else {
      setParsedParams([]);
    }
  }, [input, mode]);

  useEffect(() => {
    process();
  }, [process]);

  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar({
        message: '복사 완료',
        type: 'success',
        position: 'bottom-right',
        autoHideDuration: 2000,
      });
    } catch {
      showSnackbar({
        message: '복사에 실패했습니다.',
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 4000,
      });
    }
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const handleSample = (data: string, isEncoded: boolean) => {
    setInput(data);
    setMode(isEncoded ? 'decode' : 'encode');
  };

  return (
    <>
      {/* 모드 선택 */}
      <div className="mb-4 flex items-center gap-4">
        <Tabs
          items={TAB_ITEMS}
          onChange={(v) => setMode(v as 'encode' | 'decode')}
          value={mode}
        />
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-on-surface-secondary">
              입력 ({mode === 'encode' ? '원본' : '인코딩된 URL'})
            </label>
            <div className="flex gap-2">
              <ActionButton
                feedbackText="교체 완료"
                onClick={handleSwap}
                variant="secondary"
              >
                ↔ 전환
              </ActionButton>
              <ActionButton
                disabled={!input}
                feedbackText="초기화 완료"
                onClick={() => setInput('')}
                variant="danger"
              >
                초기화
              </ActionButton>
            </div>
          </div>
          <CodeTextarea
            onChange={setInput}
            placeholder={
              mode === 'encode'
                ? 'URL 또는 텍스트를 입력하세요'
                : '인코딩된 URL을 입력하세요'
            }
            value={input}
          />
        </div>

        {/* 출력 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-on-surface-secondary">
              결과 ({mode === 'encode' ? '인코딩됨' : '디코딩됨'})
            </label>
            {output && (
              <ActionButton
                feedbackText="복사 완료"
                onClick={() => handleCopy(output)}
                variant="secondary"
              >
                복사
              </ActionButton>
            )}
          </div>
          <div className="flex-1 relative">
            <CodeTextarea readOnly className="h-full w-full" value={output} />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface bg-opacity-90 rounded-lg">
                <div className="text-danger text-center">
                  <div className="mb-2">❌</div>
                  <div>{error}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 쿼리 파라미터 파싱 결과 */}
      {parsedParams.length > 0 && (
        <div className="mt-6 border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-surface-elevated/30 border-b border-border">
            <h3 className="text-sm font-medium text-on-surface-secondary">
              쿼리 파라미터 ({parsedParams.length}개)
            </h3>
          </div>
          <div className="divide-y divide-border">
            {parsedParams.map((param) => (
              <div
                key={`${param.key}-${param.value}`}
                className="flex items-center px-4 py-2.5 gap-4"
              >
                <span className="text-sm font-mono font-semibold text-accent min-w-[120px] shrink-0">
                  {param.key}
                </span>
                <span className="text-sm font-mono text-on-surface break-all">
                  {param.value}
                </span>
                <button
                  className="ml-auto shrink-0 text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                  onClick={() => handleCopy(param.value)}
                  title="값 복사"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 샘플 데이터 */}
      <div className="mt-6 bg-surface rounded-lg p-4 border border-border">
        <h3 className="text-sm font-medium text-on-surface-secondary mb-2">
          샘플 입력{' '}
          <span className="text-xs text-accent">(버튼을 누르면 자동 입력)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_DATA.map((sample) => (
            <ActionButton
              key={sample.label}
              feedbackText="로드 완료"
              onClick={() => handleSample(sample.data, sample.isEncoded)}
              variant="secondary"
            >
              {sample.label}
            </ActionButton>
          ))}
        </div>
      </div>
    </>
  );
}
