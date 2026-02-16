import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SortableList } from '../SortableList';

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: true }),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => <div>{children}</div>,
  verticalListSortingStrategy: {},
}));

const ItemStub = ({ item }) => <div>{item.name}</div>;

describe('SortableList', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders items and placeholder when empty', () => {
    const { rerender } = render(
      <SortableList
        containerId="a"
        collapsed={false}
        items={[]}
        sortableItemComponent={ItemStub}
        neededItemsOnly={false}
      />
    );

    expect(document.querySelector('.sortable-list__placeholder')).toBeInTheDocument();

    rerender(
      <SortableList
        containerId="a"
        collapsed={false}
        items={[{ itemId: 1, name: 'Milk' }]}
        sortableItemComponent={ItemStub}
        neededItemsOnly={false}
      />
    );

    expect(screen.getByText('Milk')).toBeInTheDocument();
  });

  it('renders nothing when collapsed', () => {
    render(
      <SortableList
        containerId="a"
        collapsed={true}
        items={[{ itemId: 1, name: 'Milk' }]}
        sortableItemComponent={ItemStub}
        neededItemsOnly={false}
      />
    );

    expect(screen.queryByText('Milk')).toBeNull();
  });
});
