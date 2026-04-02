'use client';

import { TiptapEditor, useSnackbar } from '@repo/ui';
import { useEditorStore } from '@store/editor-store';
import parserHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';
import React, { useEffect, useState } from 'react';

/**
 * Web Editor 클라이언트 컴포넌트
 *
 * 클라이언트에서 처리되는 모든 동적 로직을 담당합니다:
 * - 상태 관리 (Zustand store)
 * - Tiptap 에디터 관리
 * - HTML 포맷팅
 * - 사용자 인터랙션 처리
 * - HTML 에디터 렌더링
 */
export function WebEditorClient() {
  const {
    content,
    setContent,
    setShouldIncludeStyles,
    setUploadMode,
    shouldIncludeStyles,
    uploadMode,
  } = useEditorStore();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // ===== HTML 변환 함수 =====
  const convertToHtml = () => {
    if (!content) {
      showSnackbar({
        message: '변환할 내용이 없습니다.',
        type: 'warning',
        position: 'bottom-right',
        autoHideDuration: 3000,
      });
      return;
    }

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
        htmlEntities: true,
      });

      // Promise인 경우 처리
      if (result instanceof Promise) {
        result
          .then((formattedHtml) => {
            setHtmlValue(String(formattedHtml));
            showSnackbar({
              message: 'HTML로 변환되었습니다.',
              type: 'success',
              position: 'bottom-right',
              autoHideDuration: 3000,
            });
          })
          .catch((error) => {
            console.error('HTML 포맷팅 오류:', error);
            showSnackbar({
              message: 'HTML 포맷팅 중 오류가 발생했습니다.',
              type: 'error',
              position: 'bottom-right',
              autoHideDuration: 6000,
            });
            setHtmlValue(content);
          });
      } else {
        // 동기 함수인 경우
        setHtmlValue(String(result));
        showSnackbar({
          message: 'HTML로 변환되었습니다.',
          type: 'success',
          position: 'bottom-right',
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error('HTML 포맷팅 오류:', error);
      showSnackbar({
        message: 'HTML 포맷팅 중 오류가 발생했습니다.',
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 6000,
      });
      setHtmlValue(content);
    }
  };

  // ===== 유니코드 이스케이프 시퀀스 디코딩 =====
  const decodeUnicodeEscapes = (str: string): string => {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      return String.fromCodePoint(Number.parseInt(hex, 16));
    });
  };

  // ===== HTML 엔티티 디코딩 =====
  const decodeHtmlEntities = (str: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  // ===== 이스케이프 시퀀스 디코딩 =====
  const decodeEscapeSequences = (str: string): string => {
    return str
      .replace(/\\n/g, '<br />') // \n -> <br /> 태그
      .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // \t -> 4개의 공백 (탭)
      .replace(/\\r/g, '') // \r -> 제거 (캐리지 리턴은 HTML에서 불필요)
      .replace(/\\\\/g, '\\') // \\ -> 단일 백슬래시
      .replace(/\\"/g, '"') // \" -> 따옴표
      .replace(/\\'/g, "'"); // \' -> 작은따옴표
  };

  // ===== HTML 문자열을 에디터에 적용 =====
  const handleApplyHtml = () => {
    try {
      if (!htmlValue.trim()) {
        showSnackbar({
          message: 'HTML 문자열을 입력해주세요.',
          type: 'warning',
          position: 'bottom-right',
          autoHideDuration: 3000,
        });
        return;
      }

      // 유니코드 이스케이프 시퀀스 디코딩 (예: \u003e -> >, \u003c -> <)
      let decodedHtml = decodeUnicodeEscapes(htmlValue);

      // 일반 이스케이프 시퀀스 디코딩 (예: \n -> 개행, \t -> 탭)
      decodedHtml = decodeEscapeSequences(decodedHtml);

      // HTML 엔티티 디코딩 (예: &lt; -> <, &gt; -> >)
      decodedHtml = decodeHtmlEntities(decodedHtml);

      setContent(decodedHtml);
      showSnackbar({
        message: 'HTML이 에디터에 적용되었습니다.',
        type: 'success',
        position: 'bottom-right',
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error('HTML 적용 오류:', error);
      showSnackbar({
        message: 'HTML 적용 중 오류가 발생했습니다.',
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 6000,
      });
    }
  };

  // ===== HTML 편집 상태 =====
  const [htmlValue, setHtmlValue] = useState('');

  // ===== 이미지 업로드 핸들러 =====
  const handleImageUpload = async (file: File): Promise<string> => {
    // 파일 타입 검증 (이미지만 허용)
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.');
    }

    // 파일 크기 제한 (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
    }

    if (uploadMode === 'base64') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('파일 읽기 실패'));
          }
        };
        reader.onerror = () => reject(new Error('파일 읽기 오류'));
        reader.readAsDataURL(file);
      });
    }
    // API를 통한 업로드
    try {
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
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      showSnackbar({
        message: error instanceof Error ? error.message : '파일 업로드 실패',
        type: 'error',
        position: 'bottom-right',
        autoHideDuration: 6000,
      });
      throw error;
    }
  };

  return (
    <>
      {/* ===== 에디터 설정 영역 ===== */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          {/* FIXME: 에디터로 설정이 즉각 반영안되고 에디터 내의 내용을 수정해야만 적용되어서 임시 주석처리 */}
          {/* <label className="flex items-center gap-2 text-gray-300">
            <input
              checked={shouldIncludeStyles}
              className="rounded border-gray-600 bg-gray-700 text-blue-400 focus:ring-blue-400"
              onChange={(e) => setShouldIncludeStyles(e.target.checked)}
              type="checkbox"
            />
            <span>스타일 포함 (인라인 CSS)</span>
          </label> */}
          <div className="flex items-center gap-2 text-on-surface-secondary">
            <span className="text-sm">이미지 업로드 모드:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                checked={uploadMode === 'base64'}
                className="rounded border-border bg-surface-elevated text-accent focus:ring-accent"
                name="uploadMode"
                onChange={() => setUploadMode('base64')}
                type="radio"
                value="base64"
              />
              <span className="text-sm">Base64</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                checked={uploadMode === 'api'}
                className="rounded border-border bg-surface-elevated text-accent focus:ring-accent"
                name="uploadMode"
                onChange={() => setUploadMode('api')}
                type="radio"
                value="api"
              />
              <span className="text-sm">서버 API</span>
            </label>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
            onClick={convertToHtml}
            type="button"
          >
            HTML로 변환
          </button>
        </div>
        <TiptapEditor
          includeStyles={shouldIncludeStyles}
          onChange={setContent}
          onImageUpload={handleImageUpload}
          style={{ height: 400 }}
          value={content}
        />
      </div>

      {/* ===== HTML 결과 영역 ===== */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface-secondary">
            HTML 결과
          </h2>
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
            onClick={handleApplyHtml}
            type="button"
          >
            HTML을 에디터에 적용
          </button>
        </div>
        <div
          className="border border-border rounded-lg overflow-hidden resize-y min-h-[200px] max-h-[600px]"
          style={{ height: 400 }}
        >
          <textarea
            className="w-full h-full p-4 bg-surface text-on-surface font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            onChange={(e) => setHtmlValue(e.target.value)}
            placeholder="HTML 코드가 여기에 표시됩니다. 'HTML로 변환' 버튼을 클릭하세요."
            value={htmlValue}
          />
        </div>
      </div>
    </>
  );
}
