import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Shop } from '../Shop';

const { itemsByStoreRef } = vi.hoisted(() => ({
  itemsByStoreRef: { current: {} },
}));

vi.mock('../StoreSelector', () => ({
  StoreSelector: () => <div data-testid="store-selector" />,
}));

vi.mock('../SortableLists', () => ({
  SortableLists: ({ children }) => <div data-testid="sortable-lists">{children}</div>,
}));

vi.mock('../shop/ShopItems', () => ({
  ShopItems: ({ containerId, items, title }) => (
    <section>
      <h2>{title}</h2>
      <div data-testid={`shop-${containerId}`}>{items.map((item) => item.item.name).join(', ')}</div>
    </section>
  ),
}));

vi.mock('../../contexts/ApiContext', () => ({
  useApi: () => ({
    api: {
      getItemsByStore: () => ({
        queryKey: ['items-by-store'],
        queryFn: async () => itemsByStoreRef.current,
      }),
      getStores: () => ({
        queryKey: ['stores'],
        queryFn: async () => [],
      }),
    },
    sync: vi.fn(),
  }),
}));

vi.mock('../../contexts/CurrentStoreContext', () => ({
  useCurrentStore: () => ({
    currentStore: { id: 1, name: 'Main' },
  }),
}));

const renderShop = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Shop />
    </QueryClientProvider>
  );
};

const makeStoreItem = ({ id, itemId, name, needed, order, storeId }) => ({
  id,
  name,
  needed,
  order,
  store: storeId ? { id: storeId } : null,
  item: {
    id: itemId,
    name,
    needed,
  },
});

describe('Shop generate list mode', () => {
  it('filters not-at-this-store to needed items only', async () => {
    itemsByStoreRef.current = {
      1: [
        makeStoreItem({ id: 'si-1', itemId: 1, name: 'Milk', needed: true, order: 1, storeId: 1 }),
        makeStoreItem({ id: 'si-2', itemId: 2, name: 'Eggs', needed: false, order: null, storeId: 1 }),
      ],
      2: [
        makeStoreItem({ id: 'si-3', itemId: 3, name: 'Bread', needed: false, order: 2, storeId: 2 }),
        makeStoreItem({ id: 'si-4', itemId: 4, name: 'Apples', needed: true, order: null, storeId: 2 }),
      ],
    };

    renderShop();

    const otherStores = await screen.findByTestId('shop-other-stores');
    expect(otherStores).toHaveTextContent('Apples, Bread');

    await userEvent.click(screen.getByRole('button', { name: 'Generate list' }));

    expect(screen.getByTestId('shop-other-stores')).toHaveTextContent('Apples');
    expect(screen.getByTestId('shop-other-stores')).not.toHaveTextContent('Bread');
  });
});
