'use client';

import type { Change } from '@repo/shared/diff';
import type { IMonacoDecoration } from '@repo/ui/components/monaco-editor';

import { diffLines, diffWords } from '@repo/shared/diff';
import { ActionButton } from '@repo/ui';
import { MonacoEditor } from '@repo/ui';
import { useDiffStore } from '@store/diff-store';
import { useState, useMemo, useCallback } from 'react';

import styles from './diff.module.scss';

// diff 타입별 decoration 스타일
const REMOVED_DECORATION = {
  className: styles['diff-removed-line'],
  inlineClassName: styles['diff-removed-text'],
  glyphMarginClassName: styles['diff-gutter-removed'],
};
const ADDED_DECORATION = {
  className: styles['diff-added-line'],
  inlineClassName: styles['diff-added-text'],
  glyphMarginClassName: styles['diff-gutter-added'],
};

// diff/decoration 생성 함수 분리
function getDiffDecorations(original: string, changed: string) {
  const diffs: Change[] = diffLines(original, changed);
  let lineA = 1;
  let lineB = 1;
  const decorationsA: IMonacoDecoration[] = [];
  const decorationsB: IMonacoDecoration[] = [];
  const inlineDecorationsA: IMonacoDecoration[] = [];
  const inlineDecorationsB: IMonacoDecoration[] = [];

  diffs.forEach((part: Change) => {
    const lines = part.value.split('\n');
    const lineCount = lines.length - 1;
    if (part.added) {
      if (lineCount > 0) {
        decorationsB.push({
          range: {
            startLineNumber: lineB,
            endLineNumber: lineB + lineCount - 1,
            startColumn: 1,
            endColumn: 1,
          },
          ...ADDED_DECORATION,
          isWholeLine: true,
        });
        for (let i = 0; i < lineCount; i++) {
          const bLine = lines[i] ?? '';
          const words = diffWords('', bLine) as Change[];
          let col = 1;
          words.forEach((w) => {
            const len = [...w.value].length;
            if (w.added) {
              inlineDecorationsB.push({
                range: {
                  startLineNumber: lineB + i,
                  endLineNumber: lineB + i,
                  startColumn: col,
                  endColumn: col + len,
                },
                inlineClassName: 'diff-inline-added',
              });
            }
            col += len;
          });
        }
        lineB += lineCount;
      }
    } else if (part.removed) {
      if (lineCount > 0) {
        decorationsA.push({
          range: {
            startLineNumber: lineA,
            endLineNumber: lineA + lineCount - 1,
            startColumn: 1,
            endColumn: 1,
          },
          ...REMOVED_DECORATION,
          isWholeLine: true,
        });
        for (let i = 0; i < lineCount; i++) {
          const aLine = lines[i] ?? '';
          const words = diffWords(aLine, '') as Change[];
          let col = 1;
          words.forEach((w) => {
            const len = [...w.value].length;
            if (w.removed) {
              inlineDecorationsA.push({
                range: {
                  startLineNumber: lineA + i,
                  endLineNumber: lineA + i,
                  startColumn: col,
                  endColumn: col + len,
                },
                inlineClassName: 'diff-inline-removed',
              });
            }
            col += len;
          });
        }
        lineA += lineCount;
      }
    } else {
      for (let i = 0; i < lineCount; i++) {
        const aLine = lines[i] ?? '';
        const bLine = lines[i] ?? '';
        if (aLine !== bLine) {
          const words = diffWords(aLine, bLine) as Change[];
          let colA = 1;
          let colB = 1;
          words.forEach((w) => {
            const len = [...w.value].length;
            if (w.removed) {
              inlineDecorationsA.push({
                range: {
                  startLineNumber: lineA + i,
                  endLineNumber: lineA + i,
                  startColumn: colA,
                  endColumn: colA + len,
                },
                inlineClassName: 'diff-inline-removed',
              });
              colA += len;
            } else if (w.added) {
              inlineDecorationsB.push({
                range: {
                  startLineNumber: lineB + i,
                  endLineNumber: lineB + i,
                  startColumn: colB,
                  endColumn: colB + len,
                },
                inlineClassName: 'diff-inline-added',
              });
              colB += len;
            } else {
              colA += len;
              colB += len;
            }
          });
        }
      }
      lineA += lineCount;
      lineB += lineCount;
    }
  });
  return {
    decorationsA: decorationsA.concat(inlineDecorationsA),
    decorationsB: decorationsB.concat(inlineDecorationsB),
  };
}

function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1200);
    } catch {
      setIsCopied(false);
    }
  };
  return [isCopied, copy] as const;
}

export default function DiffPage() {
  // zustand store 사용
  const { changed, original, setBoth, setChanged, setOriginal } =
    useDiffStore();
  const [isOriginalLocked, setIsOriginalLocked] = useState(false);

  // 샘플 데이터
  const sampleA = `{
  "name": "John",
  "age": 30,
  "city": "Seoul"
}`;
  const sampleB = `{
  "name": "John",
  "age": 31,
  "country": "Korea"
}`;

  // diff 계산 및 decoration 생성
  const { decorationsA, decorationsB } = useMemo(
    () => getDiffDecorations(original, changed),
    [original, changed]
  );

  // diff 라인 여부를 빠르게 판별하기 위한 Set 생성
  const removedLineSet = useMemo(() => {
    const set = new Set<number>();
    decorationsA.forEach((dec) => {
      for (
        let i = dec.range.startLineNumber;
        i <= dec.range.endLineNumber;
        i++
      ) {
        set.add(i);
      }
    });
    return set;
  }, [decorationsA]);
  const addedLineSet = useMemo(() => {
    const set = new Set<number>();
    decorationsB.forEach((dec) => {
      for (
        let i = dec.range.startLineNumber;
        i <= dec.range.endLineNumber;
        i++
      ) {
        set.add(i);
      }
    });
    return set;
  }, [decorationsB]);

  // 행번호 커스텀 함수
  const lineNumberA = useCallback(
    (line: number) => {
      if (removedLineSet.has(line)) return `- ${line}`;
      return String(line);
    },
    [removedLineSet]
  );
  const lineNumberB = useCallback(
    (line: number) => {
      if (addedLineSet.has(line)) return `+ ${line}`;
      return String(line);
    },
    [addedLineSet]
  );

  // Original 입력 완료 후 lock
  const handleOriginalLock = () => {
    setIsOriginalLocked(true);
  };
  // Original 다시 입력 가능하게
  const handleOriginalUnlock = () => {
    setIsOriginalLocked(false);
  };

  const [isCopiedOriginal, copyOriginal] = useCopyToClipboard();
  const [isCopiedChanged, copyChanged] = useCopyToClipboard();

  return (
    <div
      className={`${styles['diff-root']} flex flex-col min-h-fit h-full p-6`}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Diff 비교기</h1>
        <p className="text-gray-400">
          Original(원본) 입력 후 변경이 불가능하며, Changed(변경본)에서만
          자유롭게 수정할 수 있습니다.
          <br />두 텍스트의 차이점이 실시간으로 하이라이트됩니다.
        </p>
      </div>

      <div className="flex flex-row gap-4 mb-4">
        {!isOriginalLocked ? (
          <ActionButton
            feedbackText={!isOriginalLocked ? '입력 대기' : '입력 완료'}
            onClick={handleOriginalLock}
            variant="primary"
          >
            비교하기
          </ActionButton>
        ) : (
          <ActionButton
            feedbackText={isOriginalLocked ? '입력 완료' : '입력 대기'}
            onClick={handleOriginalUnlock}
            variant="primary"
          >
            Original 다시 입력
          </ActionButton>
        )}
        <ActionButton
          feedbackText="샘플 적용"
          onClick={() => setBoth(sampleA, sampleB)}
          variant="secondary"
        >
          샘플 입력
        </ActionButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original (입력 후 변경불가) */}
        <div className="flex flex-col min-h-[120px]">
          <div className="flex flex-row items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Original (원본, 입력 후 변경불가)
            </label>
            <div className="flex-1" />
            <ActionButton
              feedbackText={isCopiedOriginal ? '복사됨' : '복사'}
              onClick={() => copyOriginal(original)}
              variant="secondary"
            >
              복사
            </ActionButton>
          </div>
          <MonacoEditor
            decorations={isOriginalLocked ? decorationsA : []}
            height={400}
            lineNumbers={lineNumberA}
            onChange={isOriginalLocked ? () => {} : setOriginal}
            readOnly={isOriginalLocked}
            theme="vs-dark"
            value={original}
          />
        </div>
        {/* Changed (항상 입력 가능) */}
        <div className="flex flex-col min-h-[120px]">
          <div className="flex flex-row items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Changed (변경본, 자유 입력)
            </label>
            <div className="flex-1" />
            <ActionButton
              feedbackText={isCopiedChanged ? '복사됨' : '복사'}
              onClick={() => copyChanged(changed)}
              variant="secondary"
            >
              복사
            </ActionButton>
          </div>
          <MonacoEditor
            decorations={isOriginalLocked ? decorationsB : []}
            height={400}
            lineNumbers={lineNumberB}
            onChange={setChanged}
            readOnly={false}
            theme="vs-dark"
            value={changed}
          />
        </div>
      </div>
    </div>
  );
}
