'use client';

import { ActionButton, CodeTextarea, useSnackbar } from '@repo/ui';
import { useRegexStore } from '@store/regex-store';
import { useEffect } from 'react';

// ===== 샘플 데이터 정의 =====
const SAMPLE_PATTERNS = [
  {
    id: 1,
    label: '이메일',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: 'gm',
    description: '이메일 주소 형식 검증',
  },
  {
    id: 2,
    label: '전화번호',
    pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
    flags: 'gm',
    description: '한국 휴대폰 번호 형식',
  },
  {
    id: 3,
    label: 'URL',
    pattern:
      '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:\\/~\\+#]*[\\w\\-\\@?^=%&\\/~\\+#])?$',
    flags: 'gm',
    description: 'HTTP/HTTPS URL 형식',
  },
  {
    id: 4,
    label: '한글만',
    pattern: '^[가-힣]+$',
    flags: 'gm',
    description: '한글 문자만 허용',
  },
  {
    id: 5,
    label: '숫자만',
    pattern: '^[0-9]+$',
    flags: 'gm',
    description: '숫자만 허용',
  },
  {
    id: 6,
    label: '영문+숫자',
    pattern: '^[a-zA-Z0-9]+$',
    flags: 'gm',
    description: '영문자와 숫자만 허용',
  },
  {
    id: 7,
    label: '한글 포함',
    pattern: '[가-힣]+',
    flags: 'g',
    description: '한글이 포함된 부분 찾기',
  },
  {
    id: 8,
    label: '영문 단어',
    pattern: '\\b[a-zA-Z]+\\b',
    flags: 'g',
    description: '영문 단어 경계 찾기',
  },
];

const SAMPLE_TEST_STRINGS = [
  {
    id: 1,
    label: '이메일 목록',
    text: 'test@example.com\nuser123@gmail.com\ninvalid-email\nadmin@company.co.kr',
  },
  {
    id: 2,
    label: '전화번호 목록',
    text: '010-1234-5678\n01012345678\n02-123-4567\n010-123-456',
  },
  {
    id: 3,
    label: 'URL 목록',
    text: 'https://example.com\nhttp://test.co.kr\ninvalid-url\nhttps://api.example.com/v1/users',
  },
  {
    id: 4,
    label: '한글 텍스트',
    text: '안녕하세요\nHello World\n한글과 영문\n123 숫자',
  },
];

/**
 * Regex Tester 클라이언트 컴포넌트
 *
 * 클라이언트에서 처리되는 모든 동적 로직을 담당합니다:
 * - 상태 관리 (Zustand store)
 * - 정규식 테스트 및 매치 결과 처리
 * - 사용자 인터랙션 처리
 * - 에러 처리
 * - 플래그 설정
 */
export function RegexTesterClient() {
  const {
    clearAll,
    error,
    flags,
    matches,
    pattern,
    setFlags,
    setPattern,
    setTestString,
    testRegex,
    testString,
  } = useRegexStore();

  // ===== 스낵바 훅 사용 =====
  const { showSnackbar } = useSnackbar();

  // ===== 복사 기능 =====
  const handleCopy = async (text: string) => {
    if (!text) return;

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

  // ===== 정규식 자동 테스트 =====
  useEffect(() => {
    if (pattern && testString) {
      testRegex();
    }
  }, [pattern, testString]);

  return (
    <div className="flex flex-col min-h-fit h-full p-6">
      {/* ===== 액션 버튼들 ===== */}
      <div className="mb-4 flex justify-start space-x-2">
        <ActionButton
          disabled={!pattern && !testString && !matches}
          feedbackText="초기화 완료"
          onClick={clearAll}
          variant="danger"
        >
          초기화
        </ActionButton>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== 입력 영역 ===== */}
        <div className="flex flex-col space-y-4">
          {/* ===== 정규식 패턴 입력 ===== */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                정규식 패턴
              </label>
              <ActionButton
                feedbackText="복사 완료"
                onClick={() => handleCopy(pattern)}
                variant="secondary"
              >
                복사
              </ActionButton>
            </div>
            <CodeTextarea
              className="h-24"
              onChange={setPattern}
              placeholder="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
              value={pattern}
            />
          </div>

          {/* ===== 플래그 설정 ===== */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">
              플래그
            </label>
            <div className="flex space-x-2">
              {['g', 'i', 'm', 's', 'u', 'y'].map((flag) => (
                <label key={flag} className="flex items-center space-x-2">
                  <input
                    checked={flags.includes(flag)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFlags(flags + flag);
                      } else {
                        setFlags(flags.replace(flag, ''));
                      }
                    }}
                    type="checkbox"
                  />
                  <span className="text-sm text-gray-300">{flag}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              플래그는 선택사항입니다. g: 전역 검색, i: 대소문자 무시, m:
              멀티라인, s: .이 개행 포함, u: 유니코드, y: sticky
            </div>
          </div>

          {/* ===== 테스트 문자열 입력 ===== */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                테스트할 문자열
              </label>
              <ActionButton
                feedbackText="복사 완료"
                onClick={() => handleCopy(testString)}
                variant="secondary"
              >
                복사
              </ActionButton>
            </div>
            <CodeTextarea
              className="flex-1 min-h-60"
              onChange={setTestString}
              placeholder="테스트할 문자열을 입력하세요..."
              value={testString}
            />
          </div>
        </div>

        {/* ===== 결과 영역 ===== */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              매치 결과
            </label>
            {matches && (
              <ActionButton
                feedbackText="복사 완료"
                onClick={() => handleCopy(JSON.stringify(matches, null, 2))}
                variant="secondary"
              >
                결과 복사
              </ActionButton>
            )}
          </div>
          <div className="flex-1 relative">
            {/* ===== 매치 결과 표 ===== */}
            {matches && matches.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-300 border border-gray-700 rounded-lg">
                  <thead className="bg-gray-700 text-gray-200">
                    <tr>
                      <th className="px-3 py-2">번호</th>
                      <th className="px-3 py-2">매치된 문자열</th>
                      <th className="px-3 py-2">시작 위치</th>
                      <th className="px-3 py-2">끝 위치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, idx) => (
                      <tr
                        key={`${m[0]}-${m.index ?? idx}`}
                        className="border-t border-gray-700"
                      >
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-blue-300">
                          {m[0]}
                        </td>
                        <td className="px-3 py-2">{m.index ?? '-'}</td>
                        <td className="px-3 py-2">
                          {m.index !== undefined
                            ? m.index + m[0].length - 1
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <CodeTextarea
                readOnly
                className="h-full w-full text-center"
                value={
                  error
                    ? error
                    : matches === null
                      ? '❌ 매치 결과가 없습니다.\n\n패턴이 문자열에서 찾을 수 없습니다.'
                      : '테스트 결과가 여기에 표시됩니다.'
                }
              />
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 rounded-lg">
                <div className="text-red-400 text-center">
                  <div className="mb-2">❌</div>
                  <div>{error}</div>
                </div>
              </div>
            )}
          </div>

          {/* ===== 매치 통계 ===== */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              매치 통계
            </h4>
            <div className="text-sm text-gray-400">
              {matches === null ? (
                <div className="text-gray-500">테스트를 실행해주세요.</div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <span>총 매치 수:</span>
                    <span
                      className={
                        matches.length > 0 ? 'text-green-400' : 'text-red-400'
                      }
                    >
                      {matches.length}
                    </span>
                  </div>
                  {matches.length > 0 && matches[0] && (
                    <div className="mt-1">
                      첫 번째 매치:{' '}
                      <span className="text-blue-400">
                        &quot;{matches[0][0]}&quot;
                      </span>
                    </div>
                  )}
                  {matches.length === 0 && (
                    <div className="mt-1 text-red-400">
                      패턴이 문자열에서 찾을 수 없습니다.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== 샘플 데이터 ===== */}
      <div className="mt-6 space-y-4">
        {/* ===== 샘플 패턴 ===== */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            샘플 정규식 패턴{' '}
            <span className="text-xs text-blue-400">
              (버튼을 누르면 자동 입력)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {SAMPLE_PATTERNS.map((sample) => (
              <ActionButton
                key={sample.id}
                feedbackText="로드 완료"
                onClick={() => {
                  setPattern(sample.pattern);
                  setFlags(sample.flags);
                }}
                variant="secondary"
              >
                <div className="text-left">
                  <div className="font-medium">{sample.label}</div>
                  <div className="text-xs text-gray-400">
                    {sample.description}
                  </div>
                </div>
              </ActionButton>
            ))}
          </div>
        </div>

        {/* ===== 샘플 테스트 문자열 ===== */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            샘플 테스트 문자열{' '}
            <span className="text-xs text-blue-400">
              (버튼을 누르면 자동 입력)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SAMPLE_TEST_STRINGS.map((sample) => (
              <ActionButton
                key={sample.id}
                feedbackText="로드 완료"
                onClick={() => setTestString(sample.text)}
                variant="secondary"
              >
                {sample.label}
              </ActionButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
