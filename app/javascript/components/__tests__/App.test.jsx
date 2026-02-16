import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../App';

vi.mock('../Layout', () => ({
  Layout: ({ children }) => <div>{children}</div>,
}));

vi.mock('../List', () => ({
  List: () => <div>List View</div>,
}));

vi.mock('../Shop', () => ({
  Shop: () => <div>Shop View</div>,
}));

vi.mock('../../contexts/ApiContext', () => ({
  ApiProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock('../../contexts/CurrentStoreContext', () => ({
  CurrentStoreProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock('@tanstack/react-query', () => ({
  QueryCache: function QueryCache() {},
  QueryClient: function QueryClient() {},
  QueryClientProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

describe('App', () => {
  it('renders the list route by default', () => {
    render(<App />);

    expect(screen.getByText('List View')).toBeInTheDocument();
  });
});
