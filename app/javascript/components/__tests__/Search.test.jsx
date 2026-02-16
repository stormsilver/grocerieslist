import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Search } from '../Search';

describe('Search', () => {
  it('calls onSearch as the user types', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} searchTerm="" />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'milk' } });

    expect(onSearch).toHaveBeenCalledWith('milk');
  });

  it('clears the search term', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} searchTerm="eggs" />);

    fireEvent.click(screen.getByRole('button'));

    expect(onSearch).toHaveBeenCalledWith('');
  });
});
