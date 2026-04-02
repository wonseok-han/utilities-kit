import Link from 'next/link';

/**
 * Web Editor 헤더 컴포넌트
 */
export function WebEditorHeader() {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-on-surface mb-2">Web Editor</h1>
      <p className="text-on-surface-muted">
        WYSIWYG 에디터로 문서를 작성하고, HTML 탭에서 코드를 직접 편집할 수
        있습니다.
        <br />
        이미지, 표, 코드블록 등 다양한 확장도 지원합니다.
      </p>
      <div className="mt-4 flex items-center gap-3 p-4 bg-surface/90 border border-border rounded-lg shadow">
        <span className="text-2xl">💡</span>
        <span className="text-sm text-on-surface-secondary">
          <strong>Tiptap에 대해 더 알고싶다면?</strong>{' '}
          <Link
            className="underline text-accent hover:text-accent-hover font-semibold"
            href="https://tiptap.dev/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Tiptap 공식 문서
          </Link>
          에서 더 많은 예시와 설명을 볼 수 있습니다.
        </span>
      </div>
    </div>
  );
}
