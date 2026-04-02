import { useEditorState, type Editor } from '@tiptap/react';
import React, { useEffect, useRef, useState } from 'react';

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

export function MenuBar({
  editor,
  onFileSelect,
}: {
  editor: Editor | null;
  onFileSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // 색상 팔레트 열림/닫힘 상태
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [hoveredColorName, setHoveredColorName] = useState<string | null>(null);
  const [palettePosition, setPalettePosition] = useState<{
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    marginTop?: string;
    marginBottom?: string;
  }>({});
  const colorPaletteRef = useRef<HTMLDivElement>(null);
  const colorButtonRef = useRef<HTMLButtonElement>(null);

  // 팔레트 위치 자동 조정 (fixed 포지셔닝으로 메뉴바 영역 독립)
  useEffect(() => {
    if (isColorPaletteOpen && colorButtonRef.current) {
      const buttonRect = colorButtonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const paletteHeight = 400; // 팔레트 예상 높이 (엑셀 스타일로 더 큼)
      const paletteWidth = 280; // 팔레트 예상 너비

      const position: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
      } = {};

      // 세로 방향: 아래쪽 공간이 부족하면 위쪽에 표시
      if (buttonRect.bottom + paletteHeight > viewportHeight) {
        // 위쪽에 표시 (버튼 위쪽 기준)
        position.bottom = `${viewportHeight - buttonRect.top + 4}px`;
      } else {
        // 아래쪽에 표시 (버튼 아래쪽 기준)
        position.top = `${buttonRect.bottom + 4}px`;
      }

      // 가로 방향: 오른쪽 공간이 부족하면 왼쪽으로 조정
      if (buttonRect.left + paletteWidth > viewportWidth) {
        // 오른쪽 정렬 (팔레트 오른쪽을 버튼 오른쪽에 맞춤)
        position.right = `${viewportWidth - buttonRect.right}px`;
      } else {
        // 왼쪽 정렬 (버튼 왼쪽에 맞춤)
        position.left = `${buttonRect.left}px`;
      }

      setPalettePosition(position);
    }
  }, [isColorPaletteOpen]);

  // 외부 클릭 감지하여 팔레트 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPaletteRef.current &&
        !colorPaletteRef.current.contains(event.target as Node) &&
        colorButtonRef.current &&
        !colorButtonRef.current.contains(event.target as Node)
      ) {
        setIsColorPaletteOpen(false);
      }
    };

    if (isColorPaletteOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPaletteOpen]);

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
          currentColor: null,
          currentFontSize: null,
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
        currentColor: (() => {
          try {
            return ctx.editor.getAttributes('textStyle').color ?? null;
          } catch {
            return null;
          }
        })(),
        currentFontSize: (() => {
          try {
            const fontSize = ctx.editor.getAttributes('textStyle').fontSize;
            if (typeof fontSize === 'string') {
              return fontSize.replace('px', '');
            }
            return null;
          } catch {
            return null;
          }
        })(),
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
    currentColor: null,
    currentFontSize: null,
  };

  if (!editor) return null;

  // 색상 옵션 (엑셀 스타일)
  // 자동 색상
  const automaticColor = { name: '자동', value: null };

  // 테마 색상 (6행 x 10열 = 60개)
  const themeColors = [
    // 첫 번째 행 (기본 테마 색상)
    { name: '흰색', value: '#ffffff' },
    { name: '검정', value: '#000000' },
    { name: '회색', value: '#d0cece' },
    { name: '다크블루', value: '#1f4e78' },
    { name: '청록', value: '#70ad47' },
    { name: '주황', value: '#c55a11' },
    { name: '다크그린', value: '#385723' },
    { name: '하늘', value: '#5b9bd5' },
    { name: '보라', value: '#7030a0' },
    { name: '라임', value: '#bfbf00' },
    // 두 번째 행 (80% 어둡게)
    { name: '회색 80%', value: '#a6a6a6' },
    { name: '다크블루 80%', value: '#44546a' },
    { name: '청록 80%', value: '#a9d08e' },
    { name: '주황 80%', value: '#e2b088' },
    { name: '다크그린 80%', value: '#9bc2e6' },
    { name: '하늘 80%', value: '#b4c6e7' },
    { name: '보라 80%', value: '#b1a0c7' },
    { name: '라임 80%', value: '#d8e4bc' },
    { name: '갈색', value: '#8b4513' },
    { name: '올리브', value: '#808000' },
    // 세 번째 행 (60% 어둡게)
    { name: '회색 60%', value: '#808080' },
    { name: '다크블루 60%', value: '#4472c4' },
    { name: '청록 60%', value: '#92d050' },
    { name: '주황 60%', value: '#ffc000' },
    { name: '다크그린 60%', value: '#00b050' },
    { name: '하늘 60%', value: '#00b0f0' },
    { name: '보라 60%', value: '#7030a0' },
    { name: '라임 60%', value: '#ffff00' },
    { name: '갈색 60%', value: '#c55a11' },
    { name: '올리브 60%', value: '#bfbf00' },
    // 네 번째 행 (40% 어둡게)
    { name: '회색 40%', value: '#d9d9d9' },
    { name: '다크블루 40%', value: '#8faadc' },
    { name: '청록 40%', value: '#c5e0b4' },
    { name: '주황 40%', value: '#ffe699' },
    { name: '다크그린 40%', value: '#92d050' },
    { name: '하늘 40%', value: '#9dc3e6' },
    { name: '보라 40%', value: '#b4a7d6' },
    { name: '라임 40%', value: '#ffff00' },
    { name: '갈색 40%', value: '#f4b084' },
    { name: '올리브 40%', value: '#d9e1f2' },
    // 다섯 번째 행 (20% 어둡게)
    { name: '회색 20%', value: '#ededed' },
    { name: '다크블루 20%', value: '#d0dcef' },
    { name: '청록 20%', value: '#e2efda' },
    { name: '주황 20%', value: '#fff2cc' },
    { name: '다크그린 20%', value: '#c6e0b4' },
    { name: '하늘 20%', value: '#dae3f3' },
    { name: '보라 20%', value: '#e2d9f7' },
    { name: '라임 20%', value: '#ffffcc' },
    { name: '갈색 20%', value: '#fce4d6' },
    { name: '올리브 20%', value: '#f2f2f2' },
    // 여섯 번째 행 (10% 어둡게)
    { name: '회색 10%', value: '#f2f2f2' },
    { name: '다크블루 10%', value: '#e7e6f2' },
    { name: '청록 10%', value: '#f2f2f2' },
    { name: '주황 10%', value: '#fffbf0' },
    { name: '다크그린 10%', value: '#e2efda' },
    { name: '하늘 10%', value: '#e7f0f8' },
    { name: '보라 10%', value: '#f2f0f7' },
    { name: '라임 10%', value: '#fffff0' },
    { name: '갈색 10%', value: '#fdf2e9' },
    { name: '올리브 10%', value: '#fafafa' },
  ];

  // 표준 색상 (밝은 기본 색상들)
  const standardColors = [
    { name: '빨강', value: '#ff0000' },
    { name: '주황', value: '#ff8000' },
    { name: '노랑', value: '#ffff00' },
    { name: '연두', value: '#80ff00' },
    { name: '초록', value: '#00ff00' },
    { name: '하늘', value: '#00ffff' },
    { name: '파랑', value: '#0000ff' },
    { name: '남색', value: '#000080' },
    { name: '보라', value: '#8000ff' },
    { name: '분홍', value: '#ff00ff' },
  ];

  // 폰트 크기 옵션
  const fontSizes = [
    { name: '기본', value: null },
    { name: '8px', value: '8' },
    { name: '10px', value: '10' },
    { name: '12px', value: '12' },
    { name: '14px', value: '14' },
    { name: '16px', value: '16' },
    { name: '18px', value: '18' },
    { name: '20px', value: '20' },
    { name: '24px', value: '24' },
    { name: '28px', value: '28' },
    { name: '32px', value: '32' },
    { name: '36px', value: '36' },
    { name: '48px', value: '48' },
    { name: '56px', value: '56' },
    { name: '64px', value: '64' },
    { name: '72px', value: '72' },
    { name: '80px', value: '80' },
    { name: '88px', value: '88' },
    { name: '96px', value: '96' },
    { name: '104px', value: '104' },
    { name: '112px', value: '112' },
  ];

  const baseBtn =
    'px-2 py-1 rounded border border-border bg-surface-deep hover:bg-surface-elevated transition text-sm min-w-[32px] text-center disabled:opacity-40';
  return (
    <div className="flex flex-wrap gap-2 mb-2 overflow-x-auto">
      <button
        className={`${baseBtn} cursor-pointer ${state.isBold ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        disabled={!state.canBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="굵게 (Bold)"
        type="button"
      >
        <b>B</b>
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isItalic ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        disabled={!state.canItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="기울임 (Italic)"
        type="button"
      >
        <span className="italic">I</span>
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isStrike ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        disabled={!state.canStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="취소선 (Strike)"
        type="button"
      >
        <span className="line-through">S</span>
      </button>
      <button
        className={`${baseBtn} cursor-pointer font-mono ${state.isCode ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        disabled={!state.canCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="코드 (Inline Code)"
        type="button"
      >
        {'<>'}
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isParagraph ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="문단 (Paragraph)"
        type="button"
      >
        P
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isHighlight ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="형광펜 (Highlight)"
        type="button"
      >
        <HighlightIcon />
      </button>
      {/* 텍스트 색상 선택 */}
      <div className="relative" ref={colorPaletteRef}>
        <button
          className={`${baseBtn} cursor-pointer`}
          onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
          ref={colorButtonRef}
          title="텍스트 색상"
          type="button"
        >
          <span className="relative">
            A
            <span
              className="absolute -bottom-0.5 left-0 right-0 h-1 rounded-sm"
              style={{
                backgroundColor: state.currentColor || 'currentColor',
              }}
            />
          </span>
        </button>
        {isColorPaletteOpen && (
          <div
            className="fixed bg-surface-deep border border-border rounded-lg shadow-lg p-3 z-50 min-w-[280px]"
            style={palettePosition}
          >
            {/* 자동 색상 */}
            <button
              className={`w-full mb-3 px-3 py-2 text-left rounded border-2 transition-all hover:bg-surface-elevated ${
                state.currentColor === automaticColor.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border-light'
              }`}
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setIsColorPaletteOpen(false);
              }}
              onMouseEnter={() => setHoveredColorName(automaticColor.name)}
              onMouseLeave={() => setHoveredColorName(null)}
              type="button"
            >
              <span className="text-sm font-medium text-on-surface">
                {automaticColor.name}
              </span>
            </button>

            {/* 테마 색상 */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-on-surface-muted mb-2">
                테마 색
              </div>
              <div className="grid grid-cols-10 gap-1">
                {themeColors.map((color) => (
                  <button
                    key={`theme-${color.value || 'default'}-${color.name}`}
                    className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                      state.currentColor === color.value
                        ? 'border-accent ring-2 ring-accent/50'
                        : 'border-border-light'
                    }`}
                    onClick={() => {
                      editor.chain().focus().setColor(color.value).run();
                      setIsColorPaletteOpen(false);
                    }}
                    onMouseEnter={() => setHoveredColorName(color.name)}
                    onMouseLeave={() => setHoveredColorName(null)}
                    style={{
                      backgroundColor: color.value,
                    }}
                    title={color.name}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* 표준 색상 */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-on-surface-muted mb-2">
                표준 색
              </div>
              <div className="grid grid-cols-10 gap-1">
                {standardColors.map((color) => (
                  <button
                    key={`standard-${color.value}-${color.name}`}
                    className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                      state.currentColor === color.value
                        ? 'border-accent ring-2 ring-accent/50'
                        : 'border-border-light'
                    }`}
                    onClick={() => {
                      editor.chain().focus().setColor(color.value).run();
                      setIsColorPaletteOpen(false);
                    }}
                    onMouseEnter={() => setHoveredColorName(color.name)}
                    onMouseLeave={() => setHoveredColorName(null)}
                    style={{
                      backgroundColor: color.value,
                    }}
                    title={color.name}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* 색상 이름 표시 */}
            <div className="border-t border-border-light pt-2">
              <div className="text-center text-xs text-on-surface-muted min-h-[20px]">
                {hoveredColorName || '\u00A0'}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 폰트 크기 선택 */}
      <select
        className={`${baseBtn} cursor-pointer`}
        onChange={(e) => {
          const fontSize = e.target.value || null;
          if (fontSize) {
            // FontSize extension을 사용하여 폰트 크기 설정
            editor.chain().focus().setFontSize(`${fontSize}px`).run();
          } else {
            // 폰트 크기 제거
            editor.chain().focus().unsetFontSize().run();
          }
        }}
        title="폰트 크기"
        value={state.currentFontSize || ''}
      >
        {fontSizes.map((size) => (
          <option key={size.value || 'default'} value={size.value || ''}>
            {size.name}
          </option>
        ))}
      </select>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignLeft ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="왼쪽 정렬 (Left Align)"
        type="button"
      >
        <AlignLeftIcon />
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignCenter ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="가운데 정렬 (Center Align)"
        type="button"
      >
        <AlignCenterIcon />
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignRight ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="오른쪽 정렬 (Right Align)"
        type="button"
      >
        <AlignRightIcon />
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isTextAlignJustify ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
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
            className={`${baseBtn} cursor-pointer ${state[headingKey] ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
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
        className={`${baseBtn} cursor-pointer ${state.isBulletList ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="글머리 기호 (Bullet List)"
        type="button"
      >
        • List
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isOrderedList ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="번호 매기기 (Ordered List)"
        type="button"
      >
        1. List
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isBlockquote ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="인용구 (Quote)"
        type="button"
      >
        {`" Quote`}
      </button>
      <button
        className={`${baseBtn} cursor-pointer ${state.isCodeBlock ? 'text-accent border-accent bg-accent/10 font-bold' : 'text-on-surface'}`}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="코드 블록 (Code Block)"
        type="button"
      >
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path
            d="M8 6L2 12l6 6M16 6l6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
      <label className={`${baseBtn} cursor-pointer`} title="이미지 업로드">
        📎
        <input
          accept="image/*"
          className="hidden"
          onChange={onFileSelect}
          type="file"
        />
      </label>
    </div>
  );
}
