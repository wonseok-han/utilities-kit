'use client';

import { MonacoEditor, TiptapEditor } from '@repo/ui';
import Link from 'next/link';
import parserHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';
import React, { useMemo } from 'react';

import { useEditorStore } from '../../store/editor-store';

export default function WebEditorPage() {
  const { content, setContent, setShouldIncludeStyles, shouldIncludeStyles } =
    useEditorStore();

  // HTML 포맷팅 (useMemo로 최적화)
  const formatted = useMemo(() => {
    try {
      const result = prettier.format(content, {
        parser: 'html',
        plugins: [parserHtml],
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        bracketSameLine: false,
        htmlWhitespaceSensitivity: 'css',
      });
      if (typeof result === 'string') return result;
      return content;
    } catch (_) {
      return content;
    }
  }, [content]);

  return (
    <div className="flex flex-col min-h-fit h-full p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">
          Web Editor (Tiptap)
        </h1>
        <p className="text-gray-400">
          WYSIWYG 방식으로 HTML 콘텐츠를 작성할 수 있습니다.
          <br />
          이미지, 표, 코드블록 등 다양한 확장도 지원합니다.
        </p>
        <div className="mt-4 flex items-center gap-3 p-4 bg-gray-800/90 border border-gray-600 rounded-lg shadow">
          <span className="text-2xl">💡</span>
          <span className="text-sm text-gray-200">
            <strong>Tiptap에 대해 더 알고싶다면?</strong>{' '}
            <Link
              className="underline text-blue-400 hover:text-blue-300 font-semibold"
              href="https://tiptap.dev/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Tiptap 공식 문서
            </Link>
            에서 더 많은 예시와 설명을 볼 수 있습니다.
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-300">
            <input
              checked={shouldIncludeStyles}
              className="rounded border-gray-600 bg-gray-700 text-blue-400 focus:ring-blue-400"
              onChange={(e) => setShouldIncludeStyles(e.target.checked)}
              type="checkbox"
            />
            <span>스타일 포함 (인라인 CSS)</span>
          </label>
        </div>
        <TiptapEditor
          includeStyles={shouldIncludeStyles}
          onChange={setContent}
          value={content}
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-300 mb-2">HTML 결과</h2>
        <div
          className="border border-gray-600 rounded-lg overflow-hidden resize-y min-h-[200px] max-h-[600px]"
          style={{ height: 200 }}
        >
          <MonacoEditor
            readOnly
            height="100%"
            language="html"
            lineNumbers="off"
            minimap={{ enabled: false }}
            onChange={() => {}} // 읽기 전용이므로 빈 함수
            theme="vs-dark"
            value={formatted}
          />
        </div>
      </div>
    </div>
  );
}
