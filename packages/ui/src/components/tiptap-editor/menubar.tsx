import { useEditorState, type Editor } from '@tiptap/react';

// SVG 아이콘 컴포넌트들
const HighlightIcon = () => (
  <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
    <path d="M15.6 11.48c.91-.91 2.39-.91 3.3 0l.7.7-4.7 4.7-3.3-3.3c-.91-.91-.91-2.39 0-3.3l3.3 3.3z" />
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zm0 4H3v2h12v-2z" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
    <path d="M7 15h10v2H7v-2zm0-8h10v2H7V7zm0 4h10v2H7v-2z" />
  </svg>
);

const AlignRightIcon = () => (
  <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
    <path d="M9 15h12v2H9v-2zm0-8h12v2H9V7zm0 4h12v2H9v-2z" />
  </svg>
);

const AlignJustifyIcon = () => (
  <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
    <path d="M3 15h18v2H3v-2zm0-8h18v2H3V7zm0 4h18v2H3v-2z" />
  </svg>
);

export function MenuBar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return {
          isBold: false,
          canBold: false,
          isItalic: false,
          canItalic: false,
          isStrike: false,
          canStrike: false,
          isCode: false,
          canCode: false,
          canClearMarks: false,
          isParagraph: false,
          isHeading1: false,
          isHeading2: false,
          isHeading3: false,
          isHeading4: false,
          isHeading5: false,
          isHeading6: false,
          isBulletList: false,
          isOrderedList: false,
          isCodeBlock: false,
          isBlockquote: false,
          canUndo: false,
          canRedo: false,
          isHighlight: false,
          isTextAlignLeft: false,
          isTextAlignCenter: false,
          isTextAlignRight: false,
          isTextAlignJustify: false,
        };
      }
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
        isHighlight: ctx.editor.isActive('highlight') ?? false,
        isTextAlignLeft: ctx.editor.isActive({ textAlign: 'left' }) ?? false,
        isTextAlignCenter:
          ctx.editor.isActive({ textAlign: 'center' }) ?? false,
        isTextAlignRight: ctx.editor.isActive({ textAlign: 'right' }) ?? false,
        isTextAlignJustify:
          ctx.editor.isActive({ textAlign: 'justify' }) ?? false,
      };
    },
  }) ?? {
    isBold: false,
    canBold: false,
    isItalic: false,
    canItalic: false,
    isStrike: false,
    canStrike: false,
    isCode: false,
    canCode: false,
    canClearMarks: false,
    isParagraph: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
    isHeading4: false,
    isHeading5: false,
    isHeading6: false,
    isBulletList: false,
    isOrderedList: false,
    isCodeBlock: false,
    isBlockquote: false,
    canUndo: false,
    canRedo: false,
    isHighlight: false,
    isTextAlignLeft: false,
    isTextAlignCenter: false,
    isTextAlignRight: false,
    isTextAlignJustify: false,
  };

  if (!editor) return null;

  const baseBtn =
    'px-2 py-1 rounded border border-gray-300 bg-white hover:bg-blue-50 transition text-sm min-w-[32px] text-center disabled:opacity-40';
  return (
    <div className="flex flex-wrap gap-2 mb-2 overflow-x-auto">
      <button
        className={`${baseBtn} cursor-pointer ${state.isBold ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        disabled={!state.canBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="굵게 (Bold)"
        type="button"
      >
        <b>B</b>
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isItalic ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        disabled={!state.canItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="기울임 (Italic)"
        type="button"
      >
        <span className="italic">I</span>
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isStrike ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        disabled={!state.canStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="취소선 (Strike)"
        type="button"
      >
        <span className="line-through">S</span>
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isCode ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        disabled={!state.canCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="코드 (Inline Code)"
        type="button"
      >
        {'</>'}
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isParagraph ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="문단 (Paragraph)"
        type="button"
      >
        P
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isHighlight ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="형광펜 (Highlight)"
        type="button"
      >
        <HighlightIcon />
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignLeft ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="왼쪽 정렬 (Left Align)"
        type="button"
      >
        <AlignLeftIcon />
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignCenter ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="가운데 정렬 (Center Align)"
        type="button"
      >
        <AlignCenterIcon />
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignRight ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="오른쪽 정렬 (Right Align)"
        type="button"
      >
        <AlignRightIcon />
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignJustify ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        title="양쪽 정렬 (Justify)"
        type="button"
      >
        <AlignJustifyIcon />
      </button>
      {[1, 2, 3, 4, 5, 6].map((level) => {
        const headingKey = `isHeading${level}` as keyof typeof state;
        return (
          <button
            key={level}
            className={`${baseBtn} cursor-pointer ${state[headingKey] ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                .run()
            }
            title={`제목 H${level}`}
            type="button"
          >
            {`H${level}`}
          </button>
        );
      })}
      <button
        className={`${baseBtn} cursor-pointer ${state.isBulletList ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="글머리 기호 (Bullet List)"
        type="button"
      >
        • List
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isOrderedList ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="번호 매기기 (Ordered List)"
        type="button"
      >
        1. List
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isBlockquote ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="인용구 (Quote)"
        type="button"
      >
        {`" Quote`}
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isCodeBlock ? 'text-blue-600 border-blue-400 bg-blue-50 font-bold' : 'text-gray-800'}`}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="코드 블록 (Code Block)"
        type="button"
      >
        {'</>'}
      </button>
      <button
        className={`${baseBtn} cursor-pointer`}
        onClick={() => editor.chain().focus().setHardBreak().run()}
        title="줄 바꿈 (Hard Break)"
        type="button"
      >
        ⏎
      </button>
      <button
        className={`${baseBtn} cursor-pointer`}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="구분선 (Horizontal Rule)"
        type="button"
      >
        ──
      </button>
      <button
        className={`${baseBtn} cursor-pointer`}
        disabled={!state.canClearMarks}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="모든 서식 지우기 (Clear Marks)"
        type="button"
      >
        Clear
      </button>
      <button
        className={`${baseBtn} cursor-pointer`}
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
        title="실행 취소 (Undo)"
        type="button"
      >
        ↺
      </button>
      <button
        className={`${baseBtn} cursor-pointer`}
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
        title="다시 실행 (Redo)"
        type="button"
      >
        ↻
      </button>
    </div>
  );
}
