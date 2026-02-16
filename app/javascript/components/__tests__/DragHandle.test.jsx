import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DragHandle } from '../DragHandle';

describe('DragHandle', () => {
  it('renders the grip icon', () => {
    render(<DragHandle />);

    expect(document.querySelector('i.bi-grip-vertical')).toBeInTheDocument();
  });
});
