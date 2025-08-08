'use client';

import { MonacoEditor, TiptapEditor, useSnackbar } from '@repo/ui';
import { useEditorStore } from '@store/editor-store';
import parserHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';
import React, { useEffect, useMemo } from 'react';

/**
 * Web Editor 클라이언트 컴포넌트
 *
 * 클라이언트에서 처리되는 모든 동적 로직을 담당합니다:
 * - 상태 관리 (Zustand store)
 * - Tiptap 에디터 관리
 * - HTML 포맷팅
 * - 사용자 인터랙션 처리
 * - Monaco 에디터 렌더링
 */
export function WebEditorClient() {
  const { content, setContent, setShouldIncludeStyles, shouldIncludeStyles } =
    useEditorStore();

  // ===== 스낵바 훅 사용 =====
  const { showSnackbar } = useSnackbar();

  // ===== 초기 데이터 설정 (컴포넌트 마운트 시 한 번만) =====
  useEffect(() => {
    if (!content) {
      setContent('');
    }
    if (shouldIncludeStyles === undefined) {
      setShouldIncludeStyles(true);
    }
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // ===== HTML 포맷팅 (useMemo로 최적화) =====
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
    } catch (error) {
      console.error('HTML 포맷팅 오류:', error);
      showSnackbar({
        message: 'HTML 포맷팅 중 오류가 발생했습니다.',
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 6000,
      });
      return content;
    }
  }, [content, showSnackbar]);

  return (
    <div className="flex flex-col min-h-fit h-full p-8">
      {/* ===== 에디터 설정 영역 ===== */}
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

      {/* ===== HTML 결과 영역 ===== */}
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
