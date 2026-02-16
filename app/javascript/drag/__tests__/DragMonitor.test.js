import { describe, expect, it, vi } from 'vitest';
import { hasActiveDrag, notifyDragEnd, notifyDragStart, runAfterDrag } from '../DragMonitor';

describe('DragMonitor', () => {
  it('tracks active drags and runs callbacks after drag', () => {
    const callback = vi.fn();

    notifyDragStart();
    expect(hasActiveDrag()).toBe(true);

    runAfterDrag(callback);
    expect(callback).not.toHaveBeenCalled();

    notifyDragEnd();
    expect(hasActiveDrag()).toBe(false);
    expect(callback).toHaveBeenCalled();
  });

  it('runs callbacks immediately when no drag is active', () => {
    const callback = vi.fn();

    runAfterDrag(callback);

    expect(callback).toHaveBeenCalled();
  });
});
