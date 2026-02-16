import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { SortableItem } from '../SortableItem';

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: { 'data-testid': 'sortable' },
    listeners: {},
    setNodeRef: () => {},
    transform: { x: 0, y: 10 },
    transition: 'transform 200ms',
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => 'translate(0px, 10px)' } },
}));

vi.mock('../Item', () => ({
  Item: React.forwardRef(({ children, neededItemsOnly }, ref) => (
    <div ref={ref} data-testid="sortable-item" data-needed={neededItemsOnly ? 'true' : 'false'}>
      {children}
    </div>
  )),
}));

vi.mock('../DragHandle', () => ({
  DragHandle: () => <div>Drag</div>,
}));

describe('SortableItem', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a drag handle', () => {
    render(<SortableItem item={{ id: '1' }} />);

    expect(screen.getByText('Drag')).toBeInTheDocument();
  });

  it('passes needed-only state to items', () => {
    render(<SortableItem item={{ id: '1' }} neededItemsOnly={true} />);

    expect(screen.getByTestId('sortable-item')).toHaveAttribute('data-needed', 'true');
  });
});
