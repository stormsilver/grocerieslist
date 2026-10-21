import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Shop } from '../Shop';

const { itemsByStoreRef, sortableListsRef } = vi.hoisted(() => ({
  itemsByStoreRef: { current: {} },
  sortableListsRef: { current: null },
}));

vi.mock('../StoreSelector', () => ({
  StoreSelector: () => <div data-testid="store-selector" />,
}));

vi.mock('../SortableLists', () => ({
  SortableLists: (props) => {
    sortableListsRef.current = props;
    return <div data-testid="sortable-lists">{props.children}</div>;
  },
}));

vi.mock('../shop/ShopItems', () => ({
  ShopItems: ({ containerId, items, title }) => (
    <section>
      <h2>{title}</h2>
      <div data-testid={`shop-${containerId}`}>
        {items.map((item) => (
          <label key={item.id}>
            <input
              type="checkbox"
              aria-label={`Mark ${item.item.name} as on hand`}
              checked={!item.needed}
              onChange={(event) => {
                const needed = !event.target.checked;
                item.needed = needed;
                item.item.needed = needed;
                Object.values(itemsByStoreRef.current)
                  .flat()
                  .filter((storeItem) => storeItem.itemId === item.itemId)
                  .forEach((storeItem) => {
                    storeItem.needed = needed;
                    storeItem.item.needed = needed;
                  });
              }}
            />
            {item.item.name}
          </label>
        ))}
      </div>
    </section>
  ),
}));

vi.mock('../../contexts/ApiContext', () => ({
  useApi: () => ({
    api: {
      getItemsByStore: () => ({
        queryKey: ['items-by-store'],
        queryFn: async () => JSON.parse(JSON.stringify(itemsByStoreRef.current)),
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

  const result = render(
    <QueryClientProvider client={queryClient}>
      <Shop />
    </QueryClientProvider>
  );

  return { ...result, queryClient };
};

const makeStoreItem = ({ id, itemId, name, needed, order, storeId }) => ({
  id,
  itemId,
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
  afterEach(() => {
    cleanup();
    sortableListsRef.current = null;
  });

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
    expect(otherStores).toHaveTextContent('Apples');
    expect(otherStores).toHaveTextContent('Bread');

    await userEvent.click(screen.getByRole('button', { name: 'Generate list' }));

    expect(screen.getByTestId('shop-other-stores')).toHaveTextContent('Apples');
    expect(screen.getByTestId('shop-other-stores')).not.toHaveTextContent('Bread');
  });

  it('keeps initially needed items visible after checking until Generate list is re-entered', async () => {
    itemsByStoreRef.current = {
      1: [makeStoreItem({ id: 'si-1', itemId: 1, name: 'Milk', needed: true, order: 1, storeId: 1 })],
      2: [
        makeStoreItem({ id: 'si-2', itemId: 2, name: 'Apples', needed: true, order: null, storeId: 2 }),
        makeStoreItem({ id: 'si-3', itemId: 3, name: 'Bread', needed: false, order: null, storeId: 2 }),
      ],
    };

    const { queryClient } = renderShop();
    await screen.findByText('Apples');

    await userEvent.click(screen.getByRole('button', { name: 'Generate list' }));
    expect(screen.getByTestId('shop-other-stores')).toHaveTextContent('Apples');
    expect(screen.getByTestId('shop-other-stores')).not.toHaveTextContent('Bread');

    await userEvent.click(screen.getByRole('checkbox', { name: 'Mark Apples as on hand' }));
    await queryClient.invalidateQueries({ queryKey: ['items-by-store'] });

    expect(await screen.findByText('Apples')).toBeInTheDocument();
    expect(screen.getByTestId('shop-other-stores')).not.toHaveTextContent('Bread');

    await userEvent.click(screen.getByRole('button', { name: 'Show all' }));
    await userEvent.click(screen.getByRole('button', { name: 'Generate list' }));

    expect(screen.getByTestId('shop-other-stores')).not.toHaveTextContent('Apples');
    expect(screen.getByTestId('shop-other-stores')).not.toHaveTextContent('Bread');
  });

  it('keeps the full store order unique when reordering a generated-list subset', async () => {
    itemsByStoreRef.current = {
      1: [
        makeStoreItem({ id: 'si-3', itemId: 3, name: 'Bananas', needed: true, order: 3, storeId: 1 }),
        makeStoreItem({ id: 'si-2', itemId: 2, name: 'Hidden item', needed: false, order: 2, storeId: 1 }),
        makeStoreItem({ id: 'si-1', itemId: 1, name: 'Apples', needed: true, order: 1, storeId: 1 }),
      ],
    };

    const { queryClient } = renderShop();
    await screen.findByTestId('shop-current-ordered');
    await userEvent.click(screen.getByRole('button', { name: 'Generate list' }));

    const storeItems = queryClient.getQueryData(['items-by-store'])['1'];
    const activeItem = storeItems.find((item) => item.id === 'si-3');
    const overItem = storeItems.find((item) => item.id === 'si-1');
    const drag = {
      activeContainerId: 'current-ordered',
      activeItem,
      overContainerId: 'current-ordered',
      overItem,
    };

    act(() => sortableListsRef.current.onReordering(drag));
    act(() => sortableListsRef.current.onReordered(drag));

    expect(storeItems.sort((a, b) => a.order - b.order).map((item) => [item.name, item.order])).toEqual([
      ['Bananas', 1],
      ['Apples', 2],
      ['Hidden item', 3],
    ]);
  });

  it('filters current store items when toggling needed-only', async () => {
    itemsByStoreRef.current = {
      1: [
        makeStoreItem({ id: 'si-1', itemId: 1, name: 'Milk', needed: true, order: 1, storeId: 1 }),
        makeStoreItem({ id: 'si-2', itemId: 2, name: 'Eggs', needed: false, order: null, storeId: 1 }),
      ],
      2: [makeStoreItem({ id: 'si-3', itemId: 3, name: 'Bread', needed: true, order: 2, storeId: 2 })],
    };

    renderShop();

    const ordered = await screen.findByTestId('shop-current-ordered');
    const unordered = screen.getByTestId('shop-current-unordered');

    expect(ordered).toHaveTextContent('Milk');
    expect(unordered).toHaveTextContent('Eggs');

    await userEvent.click(screen.getByRole('button', { name: 'Generate list' }));

    expect(screen.getByTestId('shop-current-ordered')).toHaveTextContent('Milk');
    expect(screen.getByTestId('shop-current-unordered')).not.toHaveTextContent('Eggs');

    await userEvent.click(screen.getByRole('button', { name: 'Show all' }));

    expect(screen.getByTestId('shop-current-unordered')).toHaveTextContent('Eggs');
  });
});
