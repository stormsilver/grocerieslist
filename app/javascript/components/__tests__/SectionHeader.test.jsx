import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SectionHeader } from '../SectionHeader';

describe('SectionHeader', () => {
  it('toggles collapse on click and keypress', () => {
    const onToggleCollapse = vi.fn();
    render(<SectionHeader title="Pantry" collapsed={false} onToggleCollapse={onToggleCollapse} />);

    fireEvent.click(screen.getByRole('button', { name: 'Pantry' }));
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(screen.getByRole('button', { name: 'Pantry' }), { key: 'Enter' });
    expect(onToggleCollapse).toHaveBeenCalledTimes(2);
  });

  it('toggles collapse from the collapse button', () => {
    const onToggleCollapse = vi.fn();
    const { container } = render(
      <SectionHeader title="Pantry" collapsed={true} onToggleCollapse={onToggleCollapse} />
    );

    fireEvent.click(container.querySelector('button.collapse-button'));

    expect(onToggleCollapse).toHaveBeenCalled();
  });
});
