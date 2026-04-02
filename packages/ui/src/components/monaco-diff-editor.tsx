'use client';

import type { DiffOnMount } from '@monaco-editor/react';
import type { editor as MonacoEditorNS } from 'monaco-editor';
import type { FC } from 'react';

import { DiffEditor } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

export interface MonacoDiffEditorProps {
  original: string;
  modified: string;
  onOriginalChange?: (value: string) => void;
  onModifiedChange?: (value: string) => void;
  language?: string;
  height?: string | number;
  theme?: string;
  renderSideBySide?: boolean;
  options?: MonacoEditorNS.IDiffEditorConstructionOptions;
}

export const MonacoDiffEditor: FC<MonacoDiffEditorProps> = ({
  height = '100%',
  language,
  modified,
  onModifiedChange,
  onOriginalChange,
  options,
  original,
  renderSideBySide = true,
  theme = 'custom-diff-dark',
}) => {
  const diffEditorRef = useRef<Parameters<DiffOnMount>[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // 내부 변경 중인지 추적하여 외부 prop 변경과 구분
  const isInternalChange = useRef(false);

  const handleMount: DiffOnMount = (editor, monaco) => {
    diffEditorRef.current = editor;

    monaco.editor.defineTheme('custom-diff-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1f2937',
        'editor.foreground': '#f9fafb',
        'editor.lineHighlightBackground': '#374151',
        'editorLineNumber.foreground': '#9ca3af',
        'editorLineNumber.activeForeground': '#f9fafb',
        'editorGutter.background': '#1f2937',
        'diffEditor.insertedTextBackground': '#22c55e26',
        'diffEditor.removedTextBackground': '#ef444426',
        'diffEditor.insertedLineBackground': '#22c55e15',
        'diffEditor.removedLineBackground': '#ef444415',
        'diffEditor.diagonalFill': '#37415166',
      },
    });
    monaco.editor.setTheme(theme);

    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();

    if (onOriginalChange) {
      originalEditor.onDidChangeModelContent(() => {
        if (!isInternalChange.current) {
          isInternalChange.current = true;
          onOriginalChange(originalEditor.getValue());
          isInternalChange.current = false;
        }
      });
    }

    if (onModifiedChange) {
      modifiedEditor.onDidChangeModelContent(() => {
        if (!isInternalChange.current) {
          isInternalChange.current = true;
          onModifiedChange(modifiedEditor.getValue());
          isInternalChange.current = false;
        }
      });
    }
  };

  // 외부에서 original/modified가 변경될 때 (좌우 교체, 샘플 입력 등) 에디터에 반영
  useEffect(() => {
    if (!diffEditorRef.current || isInternalChange.current) return;
    const originalEditor = diffEditorRef.current.getOriginalEditor();
    if (originalEditor.getValue() !== original) {
      isInternalChange.current = true;
      originalEditor.setValue(original);
      isInternalChange.current = false;
    }
  }, [original]);

  useEffect(() => {
    if (!diffEditorRef.current || isInternalChange.current) return;
    const modifiedEditor = diffEditorRef.current.getModifiedEditor();
    if (modifiedEditor.getValue() !== modified) {
      isInternalChange.current = true;
      modifiedEditor.setValue(modified);
      isInternalChange.current = false;
    }
  }, [modified]);

  // ResizeObserver
  useEffect(() => {
    if (!containerRef.current || !diffEditorRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      diffEditorRef.current?.getModifiedEditor().layout();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <DiffEditor
        height="100%"
        language={language}
        onMount={handleMount}
        options={{
          readOnly: false,
          originalEditable: true,
          renderSideBySide,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          glyphMargin: false,
          folding: true,
          lineNumbers: 'on',
          renderOverviewRuler: true,
          ...options,
        }}
        theme={theme}
      />
    </div>
  );
};
