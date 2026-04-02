'use client';

import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type HandleDirection = 'nw' | 'ne' | 'sw' | 'se';

const HANDLE_STYLES: Record<
  HandleDirection,
  { position: string; cursor: string }
> = {
  nw: { position: 'top-0 left-0 rounded-br-sm', cursor: 'cursor-nw-resize' },
  ne: { position: 'top-0 right-0 rounded-bl-sm', cursor: 'cursor-ne-resize' },
  sw: {
    position: 'bottom-0 left-0 rounded-tr-sm',
    cursor: 'cursor-sw-resize',
  },
  se: {
    position: 'bottom-0 right-0 rounded-tl-sm',
    cursor: 'cursor-se-resize',
  },
};

// 좌측 핸들은 드래그 방향을 반전
const DIRECTION_MULTIPLIER: Record<HandleDirection, number> = {
  nw: -1,
  ne: 1,
  sw: -1,
  se: 1,
};

function ResizableImageView({
  node,
  selected,
  updateAttributes,
}: {
  node: {
    attrs: { src: string; alt?: string; title?: string; width?: number };
  };
  selected: boolean;
  updateAttributes: (attrs: Record<string, unknown>) => void;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const multiplier = useRef(1);

  const handleMouseDown = useCallback(
    (direction: HandleDirection, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      startX.current = e.clientX;
      startWidth.current = imgRef.current?.offsetWidth || 300;
      multiplier.current = DIRECTION_MULTIPLIER[direction];
    },
    []
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = (e.clientX - startX.current) * multiplier.current;
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
    <NodeViewWrapper
      data-drag-handle
      as="span"
      className="inline-block relative"
    >
      <span
        className="inline-block relative group"
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : undefined,
        }}
      >
        <img
          alt={node.attrs.alt || ''}
          className={`block max-w-full h-auto rounded ${
            selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          ref={imgRef}
          src={node.attrs.src}
          style={{ width: '100%' }}
          title={node.attrs.title || undefined}
        />
        {selected &&
          (
            Object.entries(HANDLE_STYLES) as [
              HandleDirection,
              (typeof HANDLE_STYLES)[HandleDirection],
            ][]
          ).map(([dir, style]) => (
            <span
              key={dir}
              className={`absolute w-3 h-3 bg-blue-500 ${style.cursor} ${style.position}`}
              onMouseDown={(e) => handleMouseDown(dir, e)}
              style={{ touchAction: 'none' }}
            />
          ))}
      </span>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  draggable: true,

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
