'use client';

import { ToolHistory } from '@components/tool-history';
import { useToolHistory } from '@hooks/use-tool-history';
import { ActionButton, CodeTextarea, Tabs, useSnackbar } from '@repo/ui';
import { useJwtStore } from '@store';

// ===== 샘플 데이터 정의 =====
const SAMPLE_DATA = [
  {
    id: 1,
    label: '기본 JWT',
    header: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
    payload:
      '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.c2lnbmF0dXJl',
  },
  {
    id: 2,
    label: '사용자 정보',
    header: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
    payload:
      '{\n  "userId": 123,\n  "username": "홍길동",\n  "role": "admin",\n  "exp": 1735689600\n}',
    jwt: '',
  },
  {
    id: 3,
    label: '권한 정보',
    header: '{\n  "alg": "RS256",\n  "typ": "JWT",\n  "kid": "key-id-1"\n}',
    payload:
      '{\n  "iss": "https://auth.example.com",\n  "aud": "api.example.com",\n  "scope": ["read", "write"],\n  "exp": 1735689600\n}',
    jwt: '',
  },
];

/**
 * JWT Encoder/Decoder 클라이언트 컴포넌트
 *
 * 클라이언트에서 처리되는 모든 동적 로직을 담당합니다:
 * - 상태 관리 (Zustand store)
 * - JWT 인코딩/디코딩
 * - 사용자 인터랙션 처리
 * - 에러 처리
 * - 탭 전환
 */
export function JwtEncoderClient() {
  const {
    clearAll: clearJwt,
    decodeOutput,
    encodeOutput,
    error,
    headerInput,
    input,
    mode,
    payloadInput,
    processText,
    setHeaderInput,
    setInput,
    setMode,
    setPayloadInput,
    swapMode,
  } = useJwtStore();
  const {
    addEntry,
    clearAll: clearHistory,
    entries,
    removeEntry,
  } = useToolHistory('jwt-encoder');

  // ===== 현재 모드에 맞는 output 계산 =====
  const output = mode === 'encode' ? encodeOutput : decodeOutput;

  // ===== 스낵바 훅 사용 =====
  const { showSnackbar } = useSnackbar();

  // ===== 복사 기능 =====
  const handleCopy = async (text: string) => {
    if (!text) return; // 내용이 없으면 복사하지 않음

    try {
      await navigator.clipboard.writeText(text);
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

  // ===== 히스토리 복원 핸들러 =====
  const handleRestore = (value: string) => {
    if (value.includes('|||')) {
      const parts = value.split('|||');
      setHeaderInput(parts[0] ?? '');
      setPayloadInput(parts[1] ?? '');
      setMode('encode');
    } else {
      setInput(value);
      setMode('decode');
    }
  };

  // ===== 탭 아이템 정의 =====
  const tabItems = [
    { id: 'encode', label: '인코딩' },
    { id: 'decode', label: '디코딩' },
  ];

  return (
    <>
      <div className="mb-4 flex items-center space-x-4">
        <Tabs
          items={tabItems}
          onChange={(value) => setMode(value as 'encode' | 'decode')}
          value={mode}
        />
      </div>

      {mode === 'encode' ? (
        // 인코딩 모드: Header + Payload → JWT
        <div className="flex-1 flex flex-col space-y-4">
          {/* 액션 버튼들 */}
          <div className="flex justify-start space-x-2">
            <ActionButton
              disabled={!headerInput || !payloadInput}
              feedbackText="완료"
              onClick={() => {
                if (headerInput && payloadInput) {
                  addEntry(`${headerInput}|||${payloadInput}`, 'JWT Encode');
                  processText();
                }
              }}
              variant="primary"
            >
              JWT 생성
            </ActionButton>
            <ActionButton
              disabled={!output}
              feedbackText="전환 완료"
              onClick={() => output && swapMode()}
              variant="success"
            >
              ↔ 디코딩
            </ActionButton>
            <ActionButton
              disabled={!headerInput && !payloadInput && !output}
              feedbackText="초기화 완료"
              onClick={() =>
                (headerInput || payloadInput || output) && clearJwt()
              }
              variant="danger"
            >
              초기화
            </ActionButton>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Header 입력 */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-on-surface-secondary">
                  Header (헤더)
                </label>
                <ActionButton
                  feedbackText="복사 완료"
                  onClick={() => handleCopy(headerInput)}
                  variant="secondary"
                >
                  복사
                </ActionButton>
              </div>
              <div className="flex-1">
                <CodeTextarea
                  className="h-full w-full"
                  onChange={setHeaderInput}
                  placeholder='{\n  "alg": "HS256",\n  "typ": "JWT"\n}'
                  value={headerInput}
                />
              </div>
            </div>

            {/* Payload 입력 */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-on-surface-secondary">
                  Payload (페이로드)
                </label>
                <ActionButton
                  feedbackText="복사 완료"
                  onClick={() => handleCopy(payloadInput)}
                  variant="secondary"
                >
                  복사
                </ActionButton>
              </div>
              <div className="flex-1">
                <CodeTextarea
                  className="h-full w-full"
                  onChange={setPayloadInput}
                  placeholder='{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}'
                  value={payloadInput}
                />
              </div>
            </div>

            {/* 출력 영역 (JWT) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-on-surface-secondary">
                  JWT 토큰
                </label>
                <ActionButton
                  feedbackText="복사 완료"
                  onClick={() => handleCopy(output)}
                  variant="secondary"
                >
                  복사
                </ActionButton>
              </div>
              <div className="flex-1 relative">
                <CodeTextarea
                  readOnly
                  className="h-full w-full"
                  value={output}
                />
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
        </div>
      ) : (
        // 디코딩 모드: JWT → Header + Payload
        <div className="flex-1 flex flex-col space-y-4">
          {/* 액션 버튼들 */}
          <div className="flex justify-start space-x-2">
            <ActionButton
              disabled={!input}
              feedbackText="완료"
              onClick={() => {
                if (input) {
                  addEntry(input, 'JWT Decode');
                  processText();
                }
              }}
              variant="primary"
            >
              디코딩
            </ActionButton>
            <ActionButton
              disabled={!output}
              feedbackText="전환 완료"
              onClick={() => output && swapMode()}
              variant="success"
            >
              ↔ 인코딩
            </ActionButton>
            <ActionButton
              disabled={!input && !output}
              feedbackText="초기화 완료"
              onClick={() => (input || output) && clearJwt()}
              variant="danger"
            >
              초기화
            </ActionButton>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 입력 영역 (JWT) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-on-surface-secondary">
                  JWT 토큰 입력
                </label>
                <ActionButton
                  feedbackText="복사 완료"
                  onClick={() => handleCopy(input)}
                  variant="secondary"
                >
                  복사
                </ActionButton>
              </div>
              <div className="flex-1">
                <CodeTextarea
                  className="h-full w-full"
                  onChange={setInput}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.c2lnbmF0dXJl"
                  value={input}
                />
              </div>
            </div>

            {/* 출력 영역 (Decoded JSON) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-on-surface-secondary">
                  디코딩 결과 (Header + Payload)
                </label>
                <ActionButton
                  feedbackText="복사 완료"
                  onClick={() => handleCopy(output)}
                  variant="secondary"
                >
                  복사
                </ActionButton>
              </div>
              <div className="flex-1 relative">
                <CodeTextarea
                  readOnly
                  className="h-full w-full"
                  value={output}
                />
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
              onClick={() => {
                if (sample.jwt) {
                  setInput(sample.jwt);
                  setMode('decode');
                } else {
                  setHeaderInput(sample.header);
                  setPayloadInput(sample.payload);
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

      <ToolHistory
        entries={entries}
        onClear={clearHistory}
        onRemove={removeEntry}
        onRestore={handleRestore}
      />
    </>
  );
}
