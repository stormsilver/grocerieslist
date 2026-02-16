import { describe, expect, it } from 'vitest';
import { Category } from '../Category';
import { Item } from '../Item';
import { Store } from '../Store';

describe('Simple models', () => {
  it('updates from API for category', () => {
    const category = new Category();
    category.updateFromApi({ id: 3, name: 'Frozen', lockVersion: 2 });

    expect(category.id).toBe(3);
    expect(category.name).toBe('Frozen');
    expect(category.lockVersion).toBe(2);
  });

  it('updates from API for store', () => {
    const store = new Store();
    store.updateFromApi({ id: 5, name: 'West', lockVersion: 1 });

    expect(store.id).toBe(5);
    expect(store.name).toBe('West');
    expect(store.lockVersion).toBe(1);
  });

  it('updates from API for item', () => {
    const item = new Item();
    item.updateFromApi({ id: 7, name: 'Milk', needed: true, categoryId: 9, lockVersion: 4 });

    expect(item.id).toBe(7);
    expect(item.name).toBe('Milk');
    expect(item.needed).toBe(true);
    expect(item.categoryId).toBe(9);
    expect(item.lockVersion).toBe(4);
  });
});
