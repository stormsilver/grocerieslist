import { act, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

let receivedMessage;
const unsubscribe = vi.fn();
const disconnect = vi.fn();

vi.mock('@rails/actioncable', () => ({
  createConsumer: () => ({
    subscriptions: {
      create: (_params, callbacks) => {
        receivedMessage = callbacks.received;
        return { unsubscribe };
      },
    },
    disconnect,
  }),
}));

import { ApiProvider } from '../ApiContext';

const renderWithClient = () => {
  const queryClient = new QueryClient();
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <div>child</div>
      </ApiProvider>
    </QueryClientProvider>
  );

  return { invalidateSpy, ...utils };
};

describe('ApiProvider', () => {
  it('invalidates queries on Action Cable messages', () => {
    const { invalidateSpy } = renderWithClient();

    act(() => receivedMessage({ type: 'items' }));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['items-by-category'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['items-by-store'] });

    act(() => receivedMessage({ type: 'store_items' }));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['items-by-store'] });

    act(() => receivedMessage({ type: 'categories' }));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categories'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['items-by-category'] });

    act(() => receivedMessage({ type: 'stores' }));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['stores'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['items-by-store'] });
  });

  it('disconnects on unmount', () => {
    const { unmount } = renderWithClient();

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
  });
});
