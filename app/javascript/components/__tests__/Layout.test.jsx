import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Layout } from '../Layout';

const useApi = vi.fn();

vi.mock('../../contexts/ApiContext', () => ({
  useApi: () => useApi(),
}));

describe('Layout', () => {
  it('shows syncing state', () => {
    useApi.mockReturnValue({ syncState: { isSyncing: true, isError: false, isSuccess: false } });

    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(document.querySelector('.text-warning')).toBeInTheDocument();
  });

  it('shows error state', () => {
    useApi.mockReturnValue({ syncState: { isSyncing: false, isError: true, isSuccess: false } });

    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );

    expect(document.querySelector('.text-danger')).toBeInTheDocument();
  });
});
