import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrentStoreProvider, useCurrentStore } from '../CurrentStoreContext';

const wrapper = ({ children }) => <CurrentStoreProvider>{children}</CurrentStoreProvider>;

describe('CurrentStoreContext', () => {
  it('exposes currentStore and setCurrentStore', () => {
    const { result } = renderHook(() => useCurrentStore(), { wrapper });

    expect(result.current.currentStore).toBe(null);
    expect(typeof result.current.setCurrentStore).toBe('function');
  });
});
