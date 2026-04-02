'use client';

import { ActionButton, Tabs, TiptapEditor, useSnackbar } from '@repo/ui';
import { useEditorStore } from '@store/editor-store';
import parserHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const TAB_ITEMS = [
  { id: 'editor', label: 'Editor' },
  { id: 'html', label: 'HTML' },
];

/** 이스케이프/유니코드/엔티티 디코딩 */
function decodeHtml(str: string): string {
  // 유니코드 이스케이프
  let decoded = str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCodePoint(Number.parseInt(hex, 16))
  );
  // 이스케이프 시퀀스
  decoded = decoded
    .replace(/\\n/g, '<br />')
    .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\\r/g, '')
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
  // HTML 엔티티
  const textarea = document.createElement('textarea');
  textarea.innerHTML = decoded;
  return textarea.value;
}

/** prettier로 HTML 포맷팅 */
async function formatHtml(html: string): Promise<string> {
  try {
    return await prettier.format(html, {
      parser: 'html',
      plugins: [parserHtml],
      printWidth: 80,
      tabWidth: 2,
    });
  } catch {
    return html;
  }
}

export function WebEditorClient() {
  const {
    content,
    setContent,
    setUploadMode,
    shouldIncludeStyles,
    uploadMode,
  } = useEditorStore();

  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState('editor');
  const [htmlValue, setHtmlValue] = useState('');
  const isTabSwitching = useRef(false);

  // 마운트 시 초기화
  useEffect(() => {
    if (!content) setContent('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 탭 전환 핸들러
  const handleTabChange = useCallback(
    async (tab: string) => {
      isTabSwitching.current = true;

      if (tab === 'html') {
        // Editor → HTML: 에디터 내용을 포맷팅하여 HTML textarea에 표시
        const formatted = await formatHtml(content);
        setHtmlValue(formatted);
      } else if (tab === 'editor' && activeTab === 'html') {
        // HTML → Editor: HTML textarea 내용을 에디터에 적용
        if (htmlValue.trim()) {
          const decoded = decodeHtml(htmlValue);
          setContent(decoded);
        }
      }

      setActiveTab(tab);
      isTabSwitching.current = false;
    },
    [content, htmlValue, activeTab, setContent]
  );

  // 복사
  const handleCopy = async () => {
    const text = activeTab === 'html' ? htmlValue : content;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar({
        message: '복사 완료',
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

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      if (!file.type.startsWith('image/')) {
        throw new Error('이미지 파일만 업로드할 수 있습니다.');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
      }

      if (uploadMode === 'base64') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') resolve(reader.result);
            else reject(new Error('파일 읽기 실패'));
          };
          reader.onerror = () => reject(new Error('파일 읽기 오류'));
          reader.readAsDataURL(file);
        });
      }

      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '업로드 실패');
      }
      const data = await response.json();
      return data.url || data.path;
    },
    [uploadMode]
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Tabs items={TAB_ITEMS} onChange={handleTabChange} value={activeTab} />

        <div className="flex-1" />

        {/* 이미지 업로드 모드 (에디터 탭일 때만) */}
        {activeTab === 'editor' && (
          <div className="flex items-center gap-2 text-on-surface-muted">
            <span className="text-xs">이미지:</span>
            <button
              className={`px-2 py-0.5 text-xs rounded border transition-colors cursor-pointer ${
                uploadMode === 'base64'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-on-surface-muted hover:border-on-surface-muted/30'
              }`}
              onClick={() => setUploadMode('base64')}
            >
              Base64
            </button>
            <button
              className={`px-2 py-0.5 text-xs rounded border transition-colors cursor-pointer ${
                uploadMode === 'api'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-on-surface-muted hover:border-on-surface-muted/30'
              }`}
              onClick={() => setUploadMode('api')}
            >
              API
            </button>
          </div>
        )}

        <ActionButton
          feedbackText="복사 완료"
          onClick={handleCopy}
          variant="secondary"
        >
          복사
        </ActionButton>
      </div>

      {/* 에디터 / HTML 영역 */}
      <div className="flex-1 min-h-[400px] rounded-lg overflow-hidden border border-border">
        {activeTab === 'editor' ? (
          <TiptapEditor
            includeStyles={shouldIncludeStyles}
            onChange={setContent}
            onImageUpload={handleImageUpload}
            style={{ height: '100%' }}
            value={content}
          />
        ) : (
          <textarea
            className="w-full h-full p-4 bg-surface-deep text-on-surface font-mono text-sm resize-none focus:outline-none"
            onChange={(e) => setHtmlValue(e.target.value)}
            placeholder="HTML 코드를 직접 편집할 수 있습니다. Editor 탭으로 전환하면 에디터에 적용됩니다."
            value={htmlValue}
          />
        )}
      </div>
    </div>
  );
}
