import { useCallback, useEffect, useState } from 'react';

const MAX_ENTRIES = 5;

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
  } catch {
    // localStorage full or unavailable
  }
}

export function useToolHistory(toolId: string) {
  const [entries, setEntries] = useState<ToolHistoryEntry[]>([]);

  // 마운트 시 로드
  useEffect(() => {
    setEntries(loadEntries(toolId));
  }, [toolId]);

  const addEntry = useCallback(
    (input: string, label?: string) => {
      if (!input.trim()) return;

      // 같은 입력이 이미 있으면 제거 (중복 방지)
      const filtered = loadEntries(toolId).filter((e) => e.input !== input);
      const newEntry: ToolHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        input,
        label,
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...filtered].slice(0, MAX_ENTRIES);
      saveEntries(toolId, updated);
      setEntries(updated);
    },
    [toolId]
  );

  const removeEntry = useCallback(
    (id: string) => {
      const updated = loadEntries(toolId).filter((e) => e.id !== id);
      saveEntries(toolId, updated);
      setEntries(updated);
    },
    [toolId]
  );

  const clearAll = useCallback(() => {
    saveEntries(toolId, []);
    setEntries([]);
  }, [toolId]);

  return { addEntry, clearAll, entries, removeEntry };
}
