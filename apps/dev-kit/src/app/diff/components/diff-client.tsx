'use client';

import { ActionButton, MonacoDiffEditor, useSnackbar } from '@repo/ui';
import { useDiffStore } from '@store';
import { useState } from 'react';

const SAMPLE_A = `{
  "name": "John",
  "age": 30,
  "city": "Seoul",
  "hobbies": ["reading", "coding"]
}`;

const SAMPLE_B = `{
  "name": "John",
  "age": 31,
  "country": "Korea",
  "hobbies": ["reading", "gaming", "cooking"]
}`;

export function DiffClient() {
  const { changed, original, setBoth, setChanged, setOriginal } =
    useDiffStore();
  const { showSnackbar } = useSnackbar();
  const [isInline, setIsInline] = useState(false);

  const handleCopy = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar({
        message: `${label} 복사 완료`,
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

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <ActionButton
          feedbackText="샘플 적용"
          onClick={() => setBoth(SAMPLE_A, SAMPLE_B)}
          variant="secondary"
        >
          샘플 입력
        </ActionButton>
        <ActionButton
          feedbackText="교체 완료"
          onClick={() => setBoth(changed, original)}
          variant="secondary"
        >
          ↔ 좌우 교체
        </ActionButton>
        <ActionButton
          feedbackText="복사 완료"
          onClick={() => handleCopy(original, 'Original')}
          variant="secondary"
        >
          Original 복사
        </ActionButton>
        <ActionButton
          feedbackText="복사 완료"
          onClick={() => handleCopy(changed, 'Modified')}
          variant="secondary"
        >
          Modified 복사
        </ActionButton>
        <ActionButton
          feedbackText="초기화 완료"
          onClick={() => setBoth('', '')}
          variant="danger"
        >
          초기화
        </ActionButton>

        <div className="flex-1" />

        {/* 뷰 모드 토글 */}
        <button
          className={`px-3 py-1 text-sm rounded-lg border transition-colors cursor-pointer ${
            !isInline
              ? 'bg-accent/10 border-accent text-accent'
              : 'border-border text-on-surface-muted hover:border-on-surface-muted/30'
          }`}
          onClick={() => setIsInline(false)}
        >
          Side by Side
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-lg border transition-colors cursor-pointer ${
            isInline
              ? 'bg-accent/10 border-accent text-accent'
              : 'border-border text-on-surface-muted hover:border-on-surface-muted/30'
          }`}
          onClick={() => setIsInline(true)}
        >
          Inline
        </button>
      </div>

      {/* Monaco Diff Editor */}
      <div className="flex-1 min-h-[400px] rounded-lg overflow-hidden border border-border">
        <MonacoDiffEditor
          modified={changed}
          onModifiedChange={setChanged}
          onOriginalChange={setOriginal}
          original={original}
          renderSideBySide={!isInline}
        />
      </div>
    </div>
  );
}
