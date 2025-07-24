import type { OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditorNS } from 'monaco-editor';
import type { FC } from 'react';

import Editor from '@monaco-editor/react';
import { useRef, useEffect } from 'react';

/**
 * Monaco 기반 일반 코드 에디터 컴포넌트
 * @param value - 에디터 값
 * @param onChange - 값 변경 핸들러
 * @param language - 언어(예: 'json', 'javascript', 'text' 등)
 * @param height - 에디터 높이(px 또는 %)
 * @param theme - 테마('vs-dark' 등)
 * @param readOnly - 읽기 전용 여부
 * @param decorations - 하이라이트(Decoration) 정보 배열
 */
export interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string | number;
  theme?: string;
  readOnly?: boolean;
  decorations?: IMonacoDecoration[];
  lineNumbers?: 'on' | 'off' | ((line: number) => string);
}

// UI 패키지에서 사용할 수 있는 Monaco decoration 타입 정의
export interface IMonacoDecoration {
  range: {
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
  };
  className?: string;
  inlineClassName?: string;
  isWholeLine?: boolean;
  beforeContentClassName?: string;
}

// decorations를 monaco-editor 공식 타입으로 변환하는 함수
function toMonacoDecorations(
  decorations: IMonacoDecoration[]
): MonacoEditorNS.IModelDeltaDecoration[] {
  return decorations.map((d) => ({
    range: d.range,
    options: {
      className: d.className,
      inlineClassName: d.inlineClassName,
      isWholeLine: d.isWholeLine,
      beforeContentClassName: d.beforeContentClassName,
      // Monaco Editor에서 decoration이 더 잘 보이도록 추가 옵션
      hoverMessage: undefined,
      glyphMarginClassName: undefined,
      afterContentClassName: undefined,
    },
  }));
}

export const MonacoEditor: FC<MonacoEditorProps> = ({
  decorations = [],
  height = 400,
  language,
  lineNumbers = 'on',
  onChange,
  readOnly = false,
  theme = 'custom-dark',
  value,
}) => {
  const editorRef = useRef<MonacoEditorNS.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationIdsRef = useRef<string[]>([]);

  // 에디터 인스턴스 저장
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // 커스텀 테마 정의
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'delimiter', foreground: 'D4D4D4' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'constant', foreground: '4FC1FF' },
        { token: 'property', foreground: '9CDCFE' },
        { token: 'parameter', foreground: '9CDCFE' },
        { token: 'namespace', foreground: '4EC9B0' },
        { token: 'punctuation', foreground: 'D4D4D4' },
        { token: 'tag', foreground: '569CD6' },
        { token: 'attribute.name', foreground: '9CDCFE' },
        { token: 'attribute.value', foreground: 'CE9178' },
      ],
      colors: {
        'editor.background': '#1f2937', // 사이트 배경색과 일치
        'editor.foreground': '#f9fafb',
        'editor.lineHighlightBackground': '#374151',
        'editor.lineHighlightBorder': '#374151',
        'editor.selectionBackground': '#3b82f6',
        'editor.inactiveSelectionBackground': '#374151',
        'editor.findMatchBackground': '#3b82f6',
        'editor.findMatchHighlightBackground': '#1d4ed8',
        'editorCursor.foreground': '#f9fafb',
        'editorWhitespace.foreground': '#6b7280',
        'editorIndentGuide.background': '#374151',
        'editorIndentGuide.activeBackground': '#6b7280',
        'editorLineNumber.foreground': '#9ca3af',
        'editorLineNumber.activeForeground': '#f9fafb',
        'editorGutter.background': '#1f2937',
        'editorError.foreground': '#ef4444',
        'editorWarning.foreground': '#f59e0b',
        'editorInfo.foreground': '#3b82f6',
        'editorHint.foreground': '#6b7280',
        'editorBracketMatch.background': '#374151',
        'editorBracketMatch.border': '#6b7280',
        'editorOverviewRuler.border': '#374151',
        'editorOverviewRuler.findMatchForeground': '#3b82f6',
        'editorOverviewRuler.errorForeground': '#ef4444',
        'editorOverviewRuler.warningForeground': '#f59e0b',
        'editorOverviewRuler.infoForeground': '#3b82f6',
        'editorOverviewRuler.hintForeground': '#6b7280',
        'editorScrollbarSlider.background': '#4b5563',
        'editorScrollbarSlider.hoverBackground': '#6b7280',
        'editorScrollbarSlider.activeBackground': '#9ca3af',
        'editorWidget.background': '#1f2937',
        'editorWidget.border': '#374151',
        'editorSuggestWidget.background': '#1f2937',
        'editorSuggestWidget.border': '#374151',
        'editorSuggestWidget.selectedBackground': '#374151',
        'editorSuggestWidget.highlightForeground': '#3b82f6',
        'editorHoverWidget.background': '#1f2937',
        'editorHoverWidget.border': '#374151',
        'editorCodeLens.foreground': '#9ca3af',
        'editorLightBulb.foreground': '#f59e0b',
        'editorLightBulbAutoFix.foreground': '#10b981',
        'diffEditor.insertedTextBackground': 'rgba(34, 197, 94, 0.15)',
        'diffEditor.removedTextBackground': 'rgba(239, 68, 68, 0.15)',
        'diffEditor.diagonalFill': 'rgba(55, 65, 81, 0.4)',
        'diffEditor.insertedTextBorder': 'rgba(34, 197, 94, 0.6)',
        'diffEditor.removedTextBorder': 'rgba(239, 68, 68, 0.6)',
      },
    });

    // 커스텀 테마 적용
    monaco.editor.setTheme('custom-dark');
  };

  // decorations가 변경될 때마다 적용
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      // 커서 위치 저장
      const prevPosition = editorRef.current.getPosition();
      const monacoDecorations = toMonacoDecorations(decorations);
      decorationIdsRef.current = editorRef.current.deltaDecorations(
        decorationIdsRef.current,
        monacoDecorations
      );
      // 커서 위치 복원
      if (prevPosition) {
        editorRef.current.setPosition(prevPosition);
      }
    }
  }, [decorations]);

  return (
    <Editor
      height={height}
      language={language}
      {...(onChange ? { onChange: (v) => onChange(v ?? '') } : {})}
      onMount={handleEditorDidMount}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        glyphMargin: true,
        lineNumbers,
      }}
      theme={theme}
      value={value}
    />
  );
};
