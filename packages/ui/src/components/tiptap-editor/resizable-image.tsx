'use client';

import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

/** 리사이즈 가능한 이미지 NodeView */
function ResizableImageView({
  node,
  selected,
  updateAttributes,
}: {
  node: {
    attrs: { src: string; alt?: string; title?: string; width?: number };
  };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  selected: boolean;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = imgRef.current?.offsetWidth || 300;
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + diff);
      updateAttributes({ width: newWidth });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, updateAttributes]);

  return (
    <NodeViewWrapper as="span" className="inline-block relative">
      <span
        className="inline-block relative group"
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : undefined,
        }}
      >
        <img
          draggable
          alt={node.attrs.alt || ''}
          className={`block max-w-full h-auto rounded ${
            selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
          ref={imgRef}
          src={node.attrs.src}
          style={{ width: '100%' }}
          title={node.attrs.title || undefined}
        />
        {/* 리사이즈 핸들 (우하단) */}
        {selected && (
          <span
            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize rounded-tl-sm"
            onMouseDown={handleMouseDown}
            style={{ touchAction: 'none' }}
          />
        )}
      </span>
    </NodeViewWrapper>
  );
}

/** Image 확장에 리사이즈 NodeView를 추가한 커스텀 확장 */
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute('width') || element.style.width;
          return width ? parseInt(String(width), 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
