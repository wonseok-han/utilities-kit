import Link from 'next/link';

/**
 * Diff Comparator 헤더 컴포넌트
 *
 * 서버에서 렌더링되는 정적 콘텐츠로,
 * SEO 최적화를 위해 서버 컴포넌트로 구현합니다.
 */
export function DiffHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2">Diff Comparator</h1>
      <p className="text-gray-400">
        Original(원본) 입력 후 변경이 불가능하며, Changed(변경본)에서만 자유롭게
        수정할 수 있습니다.
        <br />두 텍스트의 차이점이 실시간으로 하이라이트됩니다.
      </p>
      <div className="mt-4 flex items-center gap-3 p-4 bg-gray-800/90 border border-gray-600 rounded-lg shadow">
        <span className="text-2xl">💡</span>
        <span className="text-sm text-gray-200">
          <strong>Monaco Editor에 대해 더 알고싶다면?</strong>{' '}
          <Link
            className="underline text-blue-400 hover:text-blue-300 font-semibold"
            href="https://microsoft.github.io/monaco-editor/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Monaco Editor 공식 문서
          </Link>
          에서 더 많은 예시와 설명을 볼 수 있습니다.
        </span>
      </div>
    </div>
  );
}
