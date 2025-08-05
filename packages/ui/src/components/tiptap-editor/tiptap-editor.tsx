'use client';

import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Dropcursor } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { MenuBar } from './menubar';

export interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  includeStyles?: boolean; // 스타일 포함 여부
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
 */
export function TiptapEditor({
  includeStyles = false,
  onChange,
  value = '',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Image,
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
  });

  return (
    <div
      className="resize-y overflow-auto h-48 min-h-0 max-h-[600px] max-w-full bg-white border rounded flex flex-col text-black p-2"
      onClick={() => editor?.commands.focus()}
    >
      <MenuBar editor={editor} />
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
