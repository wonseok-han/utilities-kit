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
      </p>
    </div>
  );
}
