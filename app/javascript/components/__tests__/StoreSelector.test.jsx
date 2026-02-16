import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StoreSelector } from '../StoreSelector';

const setCurrentStore = vi.fn();
let currentStore;

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [
    { id: 1, name: 'Downtown' },
    { id: 2, name: 'Uptown' },
  ] }),
}));

vi.mock('../../contexts/CurrentStoreContext', () => ({
  useCurrentStore: () => ({ currentStore, setCurrentStore }),
}));

vi.mock('../../contexts/ApiContext', () => ({
  useApi: () => ({ api: { getStores: () => ({}) } }),
}));

describe('StoreSelector', () => {
  beforeEach(() => {
    setCurrentStore.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('defaults to the first store when none selected', () => {
    currentStore = null;
    render(<StoreSelector />);

    expect(setCurrentStore).toHaveBeenCalledWith({ id: 1, name: 'Downtown' });
  });

  it('updates current store when selection changes', () => {
    currentStore = { id: 1, name: 'Downtown' };
    render(<StoreSelector />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });

    expect(setCurrentStore).toHaveBeenCalledWith({ id: 2, name: 'Uptown' });
  });
});
