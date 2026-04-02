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
    </div>
  );
}
