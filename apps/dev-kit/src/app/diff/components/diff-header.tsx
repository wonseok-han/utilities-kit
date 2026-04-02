import Link from 'next/link';

/**
 * Diff Comparator 헤더 컴포넌트
 */
export function DiffHeader() {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-on-surface mb-2">
        Diff Comparator
      </h1>
      <p className="text-on-surface-muted">
        양쪽 에디터에 텍스트를 자유롭게 입력하면 차이점이 실시간으로
        하이라이트됩니다.
      </p>
      <div className="mt-4 flex items-center gap-3 p-4 bg-surface/90 border border-border rounded-lg shadow">
        <span className="text-2xl">💡</span>
        <span className="text-sm text-on-surface-secondary">
          <strong>Monaco Editor에 대해 더 알고싶다면?</strong>{' '}
          <Link
            className="underline text-accent hover:text-accent-hover font-semibold"
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
