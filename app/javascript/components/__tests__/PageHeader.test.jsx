import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from '../PageHeader';

describe('PageHeader', () => {
  it('renders children', () => {
    render(
      <PageHeader>
        <div>Header Content</div>
      </PageHeader>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });
});
