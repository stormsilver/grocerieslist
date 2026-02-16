import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CheckCircle } from '../CheckCircle';

describe('CheckCircle', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders checked and unchecked states', () => {
    const { rerender } = render(<CheckCircle id="item-1" checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox').nextSibling.querySelector('i').className).toContain('bi-circle');

    rerender(<CheckCircle id="item-1" checked={true} onChange={() => {}} />);
    expect(screen.getByRole('checkbox').nextSibling.querySelector('i').className).toContain('bi-check-circle-fill');
  });

  it('fires onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<CheckCircle id="item-2" checked={false} onChange={onChange} />);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalled();
  });
});
