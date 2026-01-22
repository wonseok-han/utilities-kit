'use client';

import Color from '@tiptap/extension-color';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, TextStyle } from '@tiptap/extension-text-style';
import { Dropcursor } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

import { MenuBar } from './menubar';

export interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  includeStyles?: boolean; // 스타일 포함 여부
  onImageUpload?: (file: File) => Promise<string>; // 이미지 업로드 핸들러 (파일 경로 또는 base64 반환)
  style?: React.CSSProperties;
}

/**
 * CSS 스타일을 HTML에 인라인으로 포함시키는 함수
 */
function addInlineStyles(html: string): string {
  const styleMap = {
    h1: 'font-size: 2rem; font-weight: bold; margin: 1rem 0 0.5rem 0; line-height: 1.2;',
    h2: 'font-size: 1.75rem; font-weight: bold; margin: 0.875rem 0 0.4375rem 0; line-height: 1.25;',
    h3: 'font-size: 1.5rem; font-weight: bold; margin: 0.75rem 0 0.375rem 0; line-height: 1.3;',
    h4: 'font-size: 1.25rem; font-weight: bold; margin: 0.625rem 0 0.3125rem 0; line-height: 1.35;',
    h5: 'font-size: 1.125rem; font-weight: bold; margin: 0.5625rem 0 0.28125rem 0; line-height: 1.4;',
    h6: 'font-size: 1rem; font-weight: bold; margin: 0.5rem 0 0.25rem 0; line-height: 1.4;',
    p: 'margin: 0.5rem 0; line-height: 1.4;',
    ul: 'list-style-type: disc; margin: 0.5rem 0; padding-left: 1.5rem;',
    ol: 'list-style-type: decimal; margin: 0.5rem 0; padding-left: 1.5rem;',
    li: 'margin: 0.25rem 0; line-height: 1.5;',
    blockquote:
      'border-left: 4px solid #e5e7eb; margin: 1rem 0; padding-left: 1rem; color: #6b7280;',
    pre: 'background-color: #f3f4f6; border-radius: 0.375rem; padding: 1rem; margin: 1rem 0; overflow-x: auto;',
    code: 'background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em;',
    strong: 'font-weight: bold;',
    em: 'font-style: italic;',
    s: 'text-decoration: line-through;',
    hr: 'border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0;',
    mark: 'background-color: #fef3c7; padding: 0.125rem 0.25rem; border-radius: 0.25rem;',
  };

  let styledHtml = html;

  // 각 태그에 스타일 추가
  Object.entries(styleMap).forEach(([tag, style]) => {
    const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
    styledHtml = styledHtml.replace(regex, `<${tag}$1 style="${style}">`);
  });

  return styledHtml;
}

/**
 * Tiptap 기반 WYSIWYG 에디터 컴포넌트 (StarterKit + MenuBar)
 * - StarterKit만 포함
 * - 상단에 MenuBar(툴바) 포함
 * - value/onChange로 외부 상태와 연동 가능
 * - includeStyles 옵션으로 스타일 포함 가능
 * - 이미지 업로드 지원
 */
export function TiptapEditor({
  includeStyles = true,
  onChange,
  onImageUpload,
  style,
  value = '',
}: Readonly<TiptapEditorProps>) {
  // 이미지 업로드 핸들러
  const handleImageUpload = React.useCallback(
    async (file: File): Promise<string> => {
      if (onImageUpload) {
        return await onImageUpload(file);
      }
      // 기본값: base64로 변환
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
    },
    [onImageUpload]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle, // 텍스트 스타일 (필수 - Color와 함께 사용)
      Color, // 텍스트 색상
      FontSize, // 폰트 크기
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      HardBreak,
      Dropcursor,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      if (includeStyles) {
        html = addInlineStyles(html);
      }
      onChange?.(html);
    },
    immediatelyRender: false,
    editorProps: {
      handleDrop: (view, event, _slice, moved) => {
        const file = event.dataTransfer?.files?.[0];
        if (!moved && file) {
          // 이미지 파일만 허용 (이미지가 아닌 모든 파일 타입은 거부)
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            if (!editor) return false;
            handleImageUpload(file)
              .then((src) => {
                editor.chain().focus().setImage({ src }).run();
              })
              .catch((error) => {
                console.error('이미지 업로드 실패:', error);
              });
            return true;
          }
          // 이미지가 아닌 모든 파일은 명시적으로 거부 (기본 동작 방지)
          if (file.type) {
            event.preventDefault();
            return true; // 이벤트 처리했음을 표시하지만 아무것도 하지 않음
          }
        }
        return false;
      },
      handlePaste: (view, event, _slice) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          // 이미지 파일만 허용
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file && editor) {
              handleImageUpload(file)
                .then((src) => {
                  editor.chain().focus().setImage({ src }).run();
                })
                .catch((error) => {
                  console.error('이미지 업로드 실패:', error);
                });
            }
            return true;
          }
          // 이미지가 아닌 모든 파일 타입은 거부 (텍스트는 허용)
          if (
            item.type &&
            !item.type.startsWith('text/') &&
            !item.type.startsWith('text/html')
          ) {
            event.preventDefault();
            return true; // 이벤트 처리했음을 표시하지만 아무것도 하지 않음
          }
        }
        return false;
      },
    },
  });

  // value prop이 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHtml = editor.getHTML();
      // includeStyles가 켜져 있으면 인라인 스타일이 추가된 HTML과 비교
      const currentHtmlToCompare = includeStyles
        ? addInlineStyles(currentHtml)
        : currentHtml;
      // 현재 내용과 다를 때만 업데이트 (무한 루프 방지)
      if (currentHtmlToCompare !== value) {
        // HTML 문자열을 파싱하여 에디터에 적용 (emitUpdate: false로 설정하여 무한 루프 방지)
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }
  }, [editor, value, includeStyles]);

  // 파일 입력 핸들러
  const handleFileInput = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file?.type.startsWith('image/')) {
        if (!editor) return;
        handleImageUpload(file)
          .then((src) => {
            editor.chain().focus().setImage({ src }).run();
          })
          .catch((error) => {
            console.error('파일 업로드 실패:', error);
          });
      }
      // 입력 초기화
      event.target.value = '';
    },
    [editor, handleImageUpload]
  );

  return (
    <div
      className="resize-y overflow-auto min-h-0 max-h-[600px] max-w-full bg-white border rounded flex flex-col text-black p-2"
      style={style}
    >
      <MenuBar editor={editor} onFileSelect={handleFileInput} />
      {editor && (
        <div className="flex-1 min-h-0 flex flex-col overflow-auto">
          <EditorContent
            className={`customEditor flex-1 min-h-0 h-full w-full block outline-none text-black`}
            editor={editor}
            style={{
              minHeight: 0,
              width: '100%',
              height: '100%',
              outline: 'none',
              boxShadow: 'none',
              borderColor: 'transparent',
            }}
          />
        </div>
      )}
    </div>
  );
}
