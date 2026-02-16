import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ShopItems } from '../shop/ShopItems';

vi.mock('../SortableList', () => ({
  SortableList: () => <div>Sortable List</div>,
}));

describe('ShopItems', () => {
  it('renders section header and list', () => {
    render(<ShopItems containerId="current" items={[]} neededItemsOnly={false} title="In order" />);

    expect(screen.getByText('In order')).toBeInTheDocument();
    expect(screen.getByText('Sortable List')).toBeInTheDocument();
  });
});
