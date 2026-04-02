import { useCallback, useEffect, useState } from 'react';

const MAX_ENTRIES = 5;
const EVENT_NAME = 'tool-history-update';

export interface ToolHistoryEntry {
  id: string;
  input: string;
  label?: string;
  timestamp: number;
}

function getStorageKey(toolId: string) {
  return `dev-kit-history-${toolId}`;
}

function loadEntries(toolId: string): ToolHistoryEntry[] {
  if (!toolId) return [];
  try {
    const stored = localStorage.getItem(getStorageKey(toolId));
    if (!stored) return [];
    return JSON.parse(stored) as ToolHistoryEntry[];
  } catch {
    return [];
  }
}

function saveEntries(toolId: string, entries: ToolHistoryEntry[]) {
  try {
    localStorage.setItem(getStorageKey(toolId), JSON.stringify(entries));
    // 다른 훅 인스턴스에 변경 알림
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { toolId } }));
  } catch {
    // localStorage full or unavailable
  }
}

export function useToolHistory(toolId: string) {
  const [entries, setEntries] = useState<ToolHistoryEntry[]>([]);

  // 마운트 시 + toolId 변경 시 로드
  useEffect(() => {
    setEntries(loadEntries(toolId));
  }, [toolId]);

  // 다른 컴포넌트에서 addEntry 했을 때 실시간 동기화
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { toolId: string };
      if (detail.toolId === toolId) {
        setEntries(loadEntries(toolId));
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [toolId]);

  const addEntry = useCallback(
    (input: string, label?: string) => {
      if (!input.trim() || !toolId) return;

      const filtered = loadEntries(toolId).filter((e) => e.input !== input);
      const newEntry: ToolHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        input,
        label,
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...filtered].slice(0, MAX_ENTRIES);
      saveEntries(toolId, updated);
    },
    [toolId]
  );

  const removeEntry = useCallback(
    (id: string) => {
      const updated = loadEntries(toolId).filter((e) => e.id !== id);
      saveEntries(toolId, updated);
    },
    [toolId]
  );

  const clearAll = useCallback(() => {
    saveEntries(toolId, []);
  }, [toolId]);

  return { addEntry, clearAll, entries, removeEntry };
}
