import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Item } from '../Item';

const sync = vi.fn();

vi.mock('../../contexts/ApiContext', () => ({
  useApi: () => ({ sync }),
}));

describe('Item', () => {
  afterEach(() => {
    cleanup();
    sync.mockClear();
  });

  it('updates needed state and syncs', async () => {
    const item = { id: 1, name: 'Milk', needed: true };

    render(<Item item={item} />);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(item.needed).toBe(false);
    expect(sync).toHaveBeenCalled();
  });

  it('updates name and syncs', () => {
    const item = { id: 2, name: 'Eggs', needed: false };

    render(<Item item={item} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Eggs 2' } });

    expect(item.name).toBe('Eggs 2');
    expect(sync).toHaveBeenCalled();
  });
});
