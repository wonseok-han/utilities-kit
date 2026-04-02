'use client';

import { dispatchRestore, useToolHistory } from '@hooks/use-tool-history';
import { usePathname } from 'next/navigation';

export interface HistoryPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const TOOL_ID_MAP: Record<string, string> = {
  '/base64-encoder': 'base64-encoder',
  '/color-converter': 'color-converter',
  '/diff': 'diff',
  '/json-formatter': 'json-formatter',
  '/jwt-encoder': 'jwt-encoder',
  '/regex-tester': 'regex-tester',
  '/timestamp-converter': 'timestamp-converter',
  '/url-encoder': 'url-encoder',
  '/web-editor': 'web-editor',
};

const TOOL_NAME_MAP: Record<string, string> = {
  'base64-encoder': 'Base64 Encoder',
  'color-converter': 'Color Converter',
  diff: 'Diff Comparator',
  'json-formatter': 'JSON Formatter',
  'jwt-encoder': 'JWT Encoder',
  'regex-tester': 'Regex Tester',
  'timestamp-converter': 'Timestamp Converter',
  'url-encoder': 'URL Encoder',
  'web-editor': 'Web Editor',
};

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

/** 저장된 입력에서 표시용 텍스트 추출 (mode:: 접두사, ||| 구분자 정리) */
function displayText(input: string, label?: string): string {
  if (label) return label;
  let text = input;
  // mode::value 형태의 접두사 제거
  const modeSep = text.indexOf('::');
  if (modeSep !== -1 && modeSep < 10) {
    text = text.slice(modeSep + 2);
  }
  // JWT의 ||| 구분자 → 보기 좋게
  if (text.includes('|||')) {
    const parts = text.split('|||');
    return truncate(`Header + Payload: ${parts[0]?.slice(0, 20) ?? ''}...`, 50);
  }
  return truncate(text, 50);
}

function HistoryPanelContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const toolId = TOOL_ID_MAP[pathname] || '';
  const toolName = TOOL_NAME_MAP[toolId] || '';
  const { clearAll, entries, removeEntry } = useToolHistory(toolId);

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-on-surface-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="text-lg font-semibold text-on-surface">기록</h3>
        </div>
        <button
          className="p-1.5 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-elevated transition-colors cursor-pointer"
          onClick={onClose}
        >
          <svg
            className="w-5 h-5"
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

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {!toolId ? (
          <div className="p-5 text-center text-on-surface-muted text-sm">
            도구 페이지에서 기록을 확인할 수 있습니다.
          </div>
        ) : entries.length === 0 ? (
          <div className="p-5 text-center text-on-surface-muted text-sm">
            <p className="font-medium mb-1">{toolName}</p>
            <p>아직 기록이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-xs font-medium text-on-surface-secondary">
                {toolName}
              </span>
              <button
                className="text-[11px] text-on-surface-muted hover:text-danger transition-colors cursor-pointer"
                onClick={clearAll}
              >
                전체 삭제
              </button>
            </div>
            <div className="divide-y divide-border">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-5 py-3 group hover:bg-surface-elevated/20 transition-colors"
                >
                  <button
                    className="flex-1 min-w-0 text-left cursor-pointer"
                    onClick={() => dispatchRestore(toolId, entry.input)}
                    title="클릭하여 복원"
                  >
                    <p className="text-sm font-mono text-on-surface truncate">
                      {displayText(entry.input, entry.label)}
                    </p>
                    <p className="text-[11px] text-on-surface-muted mt-0.5">
                      {formatTime(entry.timestamp)}
                    </p>
                  </button>
                  <button
                    className="shrink-0 text-on-surface-muted/0 group-hover:text-on-surface-muted hover:!text-danger transition-colors cursor-pointer"
                    onClick={() => removeEntry(entry.id)}
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
          </>
        )}
      </div>
    </div>
  );
}

export function HistoryPanel({ isOpen = false, onClose }: HistoryPanelProps) {
  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 모바일: fixed 풀스크린 */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-surface transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <HistoryPanelContent onClose={onClose} />
      </div>

      {/* 데스크톱: push 방식 */}
      <div
        className="max-md:hidden flex shrink-0 h-full overflow-hidden transition-[width,min-width] duration-300 ease-in-out"
        style={{
          minWidth: isOpen ? '20rem' : '0',
          width: isOpen ? '20rem' : '0',
        }}
      >
        <div className="w-80 h-full bg-surface border-l border-border">
          <HistoryPanelContent onClose={onClose} />
        </div>
      </div>
    </>
  );
}
