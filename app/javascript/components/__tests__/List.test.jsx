import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { List } from '../List';

const categories = [
  { id: 1, name: 'Pantry' },
  { id: 2, name: 'Frozen' },
];

const itemsByCategory = {
  1: [
    { id: 11, name: 'Milk', categoryId: 1 },
    { id: 12, name: 'Bread', categoryId: 1 },
  ],
  2: [{ id: 21, name: 'Ice Cream', categoryId: 2 }],
};

vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }) => {
    if (queryKey[0] === 'categories') return { data: categories };
    if (queryKey[0] === 'items-by-category') return { data: itemsByCategory };
    return { data: null };
  },
}));

vi.mock('../../contexts/ApiContext', () => ({
  useApi: () => ({
    api: {
      getCategories: () => ({ queryKey: ['categories'] }),
      getItemsByCategory: () => ({ queryKey: ['items-by-category'] }),
    },
    sync: vi.fn(),
  }),
}));

vi.mock('../SortableLists', () => ({
  SortableLists: ({ children }) => <div>{children}</div>,
}));

vi.mock('../list/Category', () => ({
  Category: ({ category, items }) => (
    <div data-testid={`category-${category.id}`}>{items.map((item) => item.name).join(',')}</div>
  ),
}));

vi.mock('../AddCategoryButton', () => ({
  AddCategoryButton: () => <div>Add Category</div>,
}));

describe('List', () => {
  afterEach(() => {
    cleanup();
  });
  it('filters items by search term', () => {
    render(<List />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'milk' } });

    expect(screen.getByTestId('category-1')).toHaveTextContent('Milk');
    expect(screen.getByTestId('category-2')).toHaveTextContent('');
  });

  it('toggles all categories', () => {
    render(<List />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Expand all categories' })[0]);

    expect(screen.getByRole('button', { name: 'Collapse all categories' })).toBeInTheDocument();
  });
});
