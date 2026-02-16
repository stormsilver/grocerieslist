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

  it('syncs checked state when needed changes', () => {
    const item = { id: 3, name: 'Bread', needed: true };

    const { rerender } = render(<Item item={item} />);

    expect(screen.getByRole('checkbox')).not.toBeChecked();

    item.needed = false;
    rerender(<Item item={item} />);
    expect(screen.getByRole('checkbox')).toBeChecked();

    item.needed = true;
    rerender(<Item item={item} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('syncs name input when item name changes', () => {
    const item = { id: 4, name: 'Eggs', needed: false };

    const { rerender } = render(<Item item={item} />);

    expect(screen.getByRole('textbox')).toHaveValue('Eggs');

    item.name = 'Eggs Deluxe';
    rerender(<Item item={item} />);
    expect(screen.getByRole('textbox')).toHaveValue('Eggs Deluxe');
  });

  it('hides items when needed-only and item is not needed', () => {
    const item = { id: 5, name: 'Flour', needed: false };

    const { rerender } = render(<Item item={item} neededItemsOnly={true} />);
    const itemRow = screen.getByRole('textbox').closest('.item');
    expect(itemRow).toHaveClass('visually-hidden');

    item.needed = true;
    rerender(<Item item={item} neededItemsOnly={true} />);
    expect(screen.getByRole('textbox').closest('.item')).not.toHaveClass('visually-hidden');

    rerender(<Item item={item} neededItemsOnly={false} />);
    expect(screen.getByRole('textbox').closest('.item')).not.toHaveClass('visually-hidden');
  });
});
