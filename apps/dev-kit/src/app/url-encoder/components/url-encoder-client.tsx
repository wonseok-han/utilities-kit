'use client';

import { useToolHistory } from '@hooks/use-tool-history';
import { ActionButton, CodeTextarea, Tabs, useSnackbar } from '@repo/ui';
import { useCallback, useEffect, useState } from 'react';

const TAB_ITEMS = [
  { id: 'encode', label: '인코딩' },
  { id: 'decode', label: '디코딩' },
];

type EncodeType = 'uri' | 'component';

const SAMPLE_DATA = [
  {
    label: 'URL with 한글',
    data: 'https://example.com/search?q=안녕하세요&lang=ko',
    isEncoded: false,
  },
  {
    label: '인코딩된 URL',
    data: 'https://example.com/search?q=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94&lang=ko',
    isEncoded: true,
  },
  {
    label: '쿼리 파라미터',
    data: 'name=%ED%99%8D%EA%B8%B8%EB%8F%99&age=30&city=Seoul&tags=%5B%22dev%22%2C%22web%22%5D',
    isEncoded: true,
  },
  {
    label: 'Component 인코딩',
    data: 'https://example.com/path?key=value',
    isEncoded: false,
  },
];

interface ParsedParam {
  key: string;
  rawKey: string;
  rawValue: string;
  value: string;
}

function parseQueryParams(input: string): ParsedParam[] {
  try {
    let queryString = input;
    // URL에서 ? 이후 추출
    if (input.includes('?')) {
      queryString = input.split('?').slice(1).join('?');
    }
    queryString = queryString.replace(/^&/, '');
    if (!queryString) return [];

    // 수동 파싱 (raw 값도 보존)
    return queryString.split('&').map((pair) => {
      const eqIndex = pair.indexOf('=');
      const rawKey = eqIndex === -1 ? pair : pair.slice(0, eqIndex);
      const rawValue = eqIndex === -1 ? '' : pair.slice(eqIndex + 1);
      let key = rawKey;
      let value = rawValue;
      try {
        key = decodeURIComponent(rawKey);
      } catch {
        /* keep raw */
      }
      try {
        value = decodeURIComponent(rawValue);
      } catch {
        /* keep raw */
      }
      return { key, rawKey, rawValue, value };
    });
  } catch {
    return [];
  }
}

export function UrlEncoderClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<EncodeType>('uri');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [parsedParams, setParsedParams] = useState<ParsedParam[]>([]);
  const { showSnackbar } = useSnackbar();
  const { addEntry } = useToolHistory('url-encoder');

  const process = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setParsedParams([]);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(
          encodeType === 'uri' ? encodeURI(input) : encodeURIComponent(input)
        );
      } else {
        // 디코딩은 자동 감지: component 먼저 시도, 실패하면 URI
        try {
          setOutput(decodeURIComponent(input));
        } catch {
          setOutput(decodeURI(input));
        }
      }
      setError('');
      addEntry(input);
    } catch {
      setError(
        mode === 'encode'
          ? '인코딩할 수 없는 문자열입니다.'
          : '유효한 인코딩 문자열이 아닙니다.'
      );
      setOutput('');
    }

    // 쿼리 파라미터 파싱 (양쪽 모드 모두)
    const target = mode === 'decode' ? input : input;
    if (target.includes('?') || target.includes('=')) {
      setParsedParams(parseQueryParams(target));
    } else {
      setParsedParams([]);
    }
  }, [input, mode, encodeType, addEntry]);

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
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Tabs
          items={TAB_ITEMS}
          onChange={(v) => setMode(v as 'encode' | 'decode')}
          value={mode}
        />

        {/* 인코딩 타입 (인코딩 모드일 때만) */}
        {mode === 'encode' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-muted">방식:</span>
            <button
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                encodeType === 'uri'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-on-surface-muted hover:border-on-surface-muted/30'
              }`}
              onClick={() => setEncodeType('uri')}
              title="URL 구조(://?&= 등)를 유지하고 값만 인코딩"
            >
              encodeURI
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                encodeType === 'component'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-on-surface-muted hover:border-on-surface-muted/30'
              }`}
              onClick={() => setEncodeType('component')}
              title="모든 특수문자를 인코딩 (쿼리 파라미터 값에 적합)"
            >
              encodeURIComponent
            </button>
          </div>
        )}
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
                key={`${param.rawKey}-${param.rawValue}`}
                className="flex items-center px-4 py-2.5 gap-4"
              >
                <span className="text-sm font-mono font-semibold text-accent min-w-[120px] shrink-0">
                  {param.key}
                </span>
                <span className="text-sm font-mono text-on-surface break-all flex-1">
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
