import Link from 'next/link';

/**
 * Web Editor 헤더 컴포넌트
 *
 * 서버에서 렌더링되는 정적 콘텐츠로,
 * SEO 최적화를 위해 서버 컴포넌트로 구현합니다.
 */
export function WebEditorHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-blue-400 mb-2">
        Web Editor (Tiptap)
      </h1>
      <p className="text-gray-400">
        WYSIWYG 방식으로 HTML 콘텐츠를 작성할 수 있습니다.
        <br />
        이미지, 표, 코드블록 등 다양한 확장도 지원합니다.
      </p>
      <div className="mt-4 flex items-center gap-3 p-4 bg-gray-800/90 border border-gray-600 rounded-lg shadow">
        <span className="text-2xl">💡</span>
        <span className="text-sm text-gray-200">
          <strong>Tiptap에 대해 더 알고싶다면?</strong>{' '}
          <Link
            className="underline text-blue-400 hover:text-blue-300 font-semibold"
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
