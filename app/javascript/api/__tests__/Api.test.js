import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../BagOfHolding', () => {
  const instances = new Map();

  class MockBagOfHolding {
    constructor({ key, klass }) {
      this.key = key;
      this.klass = klass;
      this.data = [];
      this.isEmpty = false;
      this.save = vi.fn(async () => {});
      this.fetchAllIfEmpty = vi.fn(async () => this.data);
      this.fetchAll = vi.fn(async () => this.data);
      this.findOne = vi.fn((id) => this.data.find((item) => item.id === id));
      this.createOne = vi.fn((item) => this.data.push(item));
      instances.set(key, this);
    }
  }

  return { BagOfHolding: MockBagOfHolding, __getInstances: () => instances };
});

import { Api, UNCATEGORIZED_CATEGORY_ID } from '../Api';
import { StoreItem } from '../../models/StoreItem';
import { __getInstances } from '../BagOfHolding';

describe('Api', () => {
  beforeEach(() => {
    __getInstances().clear();
  });

  it('synchronizes only non-empty bags', async () => {
    const api = new Api();
    const items = __getInstances().get('items');
    const storeItems = __getInstances().get('storeItems');

    items.isEmpty = true;
    storeItems.isEmpty = false;

    await api.synchronize();

    expect(items.save).not.toHaveBeenCalled();
    expect(storeItems.save).toHaveBeenCalled();
  });

  it('saves categories and stores', async () => {
    const api = new Api();
    const categories = __getInstances().get('categories');
    const stores = __getInstances().get('stores');

    await api.save();

    expect(categories.save).toHaveBeenCalled();
    expect(stores.save).toHaveBeenCalled();
  });

  it('groups items by category with uncategorized fallback', async () => {
    const api = new Api();
    const categories = __getInstances().get('categories');
    const items = __getInstances().get('items');

    categories.data = [{ id: 10, name: 'Pantry' }];
    items.data = [
      { id: 1, name: 'Milk', categoryId: 10 },
      { id: 2, name: 'Paper Towels', categoryId: null },
    ];

    const result = await api.getItemsByCategory().queryFn();

    expect(result[10]).toHaveLength(1);
    expect(result[UNCATEGORIZED_CATEGORY_ID]).toHaveLength(1);
  });

  it('adds missing store items when generating items by store', async () => {
    const api = new Api();
    const stores = __getInstances().get('stores');
    const items = __getInstances().get('items');
    const storeItems = __getInstances().get('storeItems');

    const store = { id: 1, name: 'Main' };
    const itemOne = { id: 11, name: 'Milk' };
    const itemTwo = { id: 12, name: 'Eggs' };

    stores.data = [store];
    items.data = [itemOne, itemTwo];
    storeItems.data = [new StoreItem({ store, order: 1, item: itemOne })];

    const result = await api.getItemsByStore().queryFn();

    expect(result[store.id]).toHaveLength(1);
    expect(result[undefined]).toHaveLength(1);
  });
});
