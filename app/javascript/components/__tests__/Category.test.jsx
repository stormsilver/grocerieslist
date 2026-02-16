import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Category } from '../list/Category';

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: true }),
}));

vi.mock('../AddItemButton', () => ({
  AddItemButton: () => <div>Add Item</div>,
}));

vi.mock('../SortableList', () => ({
  SortableList: () => <div>Sortable List</div>,
}));

describe('Category', () => {
  it('renders header, add button, and sortable list', () => {
    const category = { id: 1, name: 'Pantry' };

    render(<Category category={category} collapsed={true} onToggleCollapse={() => {}} items={[]} />);

    expect(screen.getByText('Pantry')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
    expect(screen.getByText('Sortable List')).toBeInTheDocument();
  });
});
