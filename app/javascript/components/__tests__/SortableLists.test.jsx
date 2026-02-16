import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SortableLists } from '../SortableLists';

const notifyDragStart = vi.fn();
const notifyDragEnd = vi.fn();
let latestProps;
let pointerWithin;
let rectIntersection;
let getFirstCollision;
let closestCenter;

vi.mock('../../drag/DragMonitor', () => ({
  notifyDragStart: () => notifyDragStart(),
  notifyDragEnd: () => notifyDragEnd(),
}));

vi.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
  DndContext: ({ children, ...props }) => {
    latestProps = props;
    return <div data-testid="dnd-context">{children}</div>;
  },
  MouseSensor: function MouseSensor() {},
  TouchSensor: function TouchSensor() {},
  useSensor: () => ({}),
  useSensors: () => [],
  MeasuringStrategy: { Always: 'always' },
  pointerWithin: (...args) => pointerWithin(...args),
  rectIntersection: (...args) => rectIntersection(...args),
  getFirstCollision: (...args) => getFirstCollision(...args),
  closestCenter: (...args) => closestCenter(...args),
}));

vi.mock('@dnd-kit/modifiers', () => ({
  restrictToVerticalAxis: () => {},
}));

describe('SortableLists', () => {
  beforeEach(() => {
    window.scrollBy = vi.fn();
    window.requestAnimationFrame = vi.fn(() => 1);
    window.cancelAnimationFrame = vi.fn();
    pointerWithin = vi.fn(() => []);
    rectIntersection = vi.fn(() => []);
    getFirstCollision = vi.fn(() => null);
    closestCenter = vi.fn(() => [{ id: 'child-1' }]);
  });

  it('handles drag lifecycle events', () => {
    const onReordering = vi.fn();
    const onReordered = vi.fn();
    const allItems = [
      { id: '1', name: 'Milk' },
      { id: '2', name: 'Eggs' },
    ];

    render(
      <SortableLists
        dragOverlayComponent={({ item }) => <div>{item.name}</div>}
        allItems={allItems}
        itemsByContainer={{ a: ['1'], b: ['2'] }}
        onReordering={onReordering}
        onReordered={onReordered}
      >
        <div>Child</div>
      </SortableLists>
    );

    act(() => {
      latestProps.onDragStart({
        active: {
          id: '1',
          data: { current: { containerId: 'a' } },
        },
      });
    });

    expect(notifyDragStart).toHaveBeenCalled();
    expect(screen.getByTestId('drag-overlay')).toHaveTextContent('Milk');

    act(() => {
      latestProps.onDragOver({
        active: { id: '1', data: { current: { containerId: 'a' } } },
        over: { id: '2', data: { current: { containerId: 'b' } } },
      });
    });

    expect(onReordering).toHaveBeenCalled();

    act(() => {
      latestProps.onDragEnd({
        active: { id: '1', data: { current: { containerId: 'a' } } },
        over: { id: '2', data: { current: { containerId: 'b' } } },
      });
    });

    expect(onReordered).toHaveBeenCalled();
    expect(notifyDragEnd).toHaveBeenCalled();
  });

  it('ignores drag over with same item', () => {
    const onReordering = vi.fn();
    render(
      <SortableLists
        dragOverlayComponent={() => null}
        allItems={[{ id: '1', name: 'Milk' }]}
        itemsByContainer={{ a: ['1'] }}
        onReordering={onReordering}
        onReordered={() => {}}
      >
        <div>Child</div>
      </SortableLists>
    );

    act(() => {
      latestProps.onDragOver({
        active: { id: '1', data: { current: { containerId: 'a' } } },
        over: { id: '1', data: { current: { containerId: 'a' } } },
      });
    });

    expect(onReordering).not.toHaveBeenCalled();
  });

  it('chooses child collision when dragging over a container', () => {
    const allItems = [{ id: '1', name: 'Milk' }];

    render(
      <SortableLists
        dragOverlayComponent={() => null}
        allItems={allItems}
        itemsByContainer={{ a: ['1'] }}
        onReordering={() => {}}
        onReordered={() => {}}
      >
        <div>Child</div>
      </SortableLists>
    );

    pointerWithin.mockReturnValue([{ id: 'container-a' }]);
    getFirstCollision.mockReturnValue('container-a');

    const result = latestProps.collisionDetection({
      active: { id: '1' },
      droppableContainers: [
        { id: 'container-a', data: { current: { containerId: 'a' } } },
        { id: '1', data: { current: { sortable: { containerId: 'a' } } } },
      ],
    });

    expect(result).toEqual([{ id: 'child-1' }]);
  });
});
