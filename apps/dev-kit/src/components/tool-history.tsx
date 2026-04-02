'use client';

import type { ToolHistoryEntry } from '@hooks/use-tool-history';

interface ToolHistoryProps {
  entries: ToolHistoryEntry[];
  onClear: () => void;
  onRemove: (id: string) => void;
  onRestore: (input: string) => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const time = d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return time;
  return `${d.getMonth() + 1}/${d.getDate()} ${time}`;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export function ToolHistory({
  entries,
  onClear,
  onRemove,
  onRestore,
}: ToolHistoryProps) {
  if (entries.length === 0) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated/30 border-b border-border">
        <h3 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider">
          최근 기록
        </h3>
        <button
          className="text-[11px] text-on-surface-muted hover:text-danger transition-colors cursor-pointer"
          onClick={onClear}
        >
          전체 삭제
        </button>
      </div>
      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 px-4 py-2 group hover:bg-surface-elevated/20 transition-colors"
          >
            <button
              className="flex-1 min-w-0 text-left cursor-pointer"
              onClick={() => onRestore(entry.input)}
              title="클릭하여 복원"
            >
              <p className="text-sm font-mono text-on-surface truncate">
                {entry.label || truncate(entry.input, 60)}
              </p>
              <p className="text-[11px] text-on-surface-muted mt-0.5">
                {formatTime(entry.timestamp)}
              </p>
            </button>
            <button
              className="shrink-0 text-on-surface-muted/0 group-hover:text-on-surface-muted hover:!text-danger transition-colors cursor-pointer"
              onClick={() => onRemove(entry.id)}
              title="삭제"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
