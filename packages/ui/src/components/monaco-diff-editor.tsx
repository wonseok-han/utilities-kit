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
        onOriginalChange(originalEditor.getValue());
      });
    }

    if (onModifiedChange) {
      modifiedEditor.onDidChangeModelContent(() => {
        onModifiedChange(modifiedEditor.getValue());
      });
    }
  };

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
        modified={modified}
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
        original={original}
        theme={theme}
      />
    </div>
  );
};
