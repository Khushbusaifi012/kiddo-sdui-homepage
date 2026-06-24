import React, { memo } from 'react';
import type { BlockNode } from './types';
import { resolveBlockComponent } from './ComponentRegistry';

interface BlockRendererProps {
  block: BlockNode;
}

function BlockRendererComponent({ block }: BlockRendererProps) {
  const Component = resolveBlockComponent(block.type);

  if (!Component) {
    if (__DEV__) {
      console.warn(`[SDUI] Dropping unsupported block type: ${block.type} (id: ${block.id})`);
    }
    return null;
  }

  return <Component block={block} />;
}

export const BlockRenderer = memo(
  BlockRendererComponent,
  (prev, next) =>
    prev.block.id === next.block.id &&
    prev.block.type === next.block.type &&
    prev.block.data === next.block.data &&
    prev.block.action === next.block.action,
);

BlockRenderer.displayName = 'BlockRenderer';
