import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DragOverlay,
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { notifyDragStart, notifyDragEnd } from '../drag/DragMonitor';

const SCROLL_EDGE_THRESHOLD = 160;
const MAX_SCROLL_SPEED = 150;
const SCROLL_ACCELERATION_EXPONENT = 1.35;
const EDGE_INTENSITY_THRESHOLD = 0.995;
const EDGE_TIME_TO_MAX_MS = 1800;
const EDGE_MAX_TIME_MULTIPLIER = 3.5;

const getTimestamp = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

const reorderPropsFromDragEvent = (event, allItems) => {
  const { active, over } = event;

  if (!active || !over) return null;

  const currentActive = active.data.current;
  const currentOver = over.data.current;

  if (!currentActive || !currentOver) return null;

  const activeContainerId = currentActive.sortable ? currentActive.sortable.containerId : currentActive.containerId;
  const overContainerId = currentOver.sortable ? currentOver.sortable.containerId : currentOver.containerId;
  const activeItem = allItems.find((item) => item.id === active.id);
  const overItem = allItems.find((item) => item.id === over.id);

  if (!activeItem) return null;

  return {
    activeContainerId,
    activeItem,
    overContainerId,
    overItem,
  };
};

export const SortableLists = ({
  dragOverlayComponent,
  allItems,
  itemsByContainer = {},
  onReordering,
  onReordered,
  children,
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const lastOverId = useRef(null);
  const recentlyMovedToNewContainer = useRef(false);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const scrollState = useRef({
    frameId: null,
    baseVelocity: 0,
    intensity: 0,
    holdStartAt: null,
  });

  const scheduleRecentlyMovedReset = useCallback(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, []);

  const cancelScrollFrame = useCallback(() => {
    const { frameId } = scrollState.current;
    if (frameId != null) {
      cancelAnimationFrame(frameId);
      scrollState.current.frameId = null;
    }
  }, []);

  const resetScroll = useCallback(() => {
    cancelScrollFrame();
    scrollState.current.baseVelocity = 0;
    scrollState.current.intensity = 0;
    scrollState.current.holdStartAt = null;
  }, [cancelScrollFrame]);

  const stepScroll = useCallback(() => {
    if (typeof window === 'undefined') {
      resetScroll();
      return;
    }

    const state = scrollState.current;
    const baseVelocity = state.baseVelocity;

    if (baseVelocity === 0) {
      resetScroll();
      return;
    }

    const atEdgeSpeed =
      Math.abs(baseVelocity) >= MAX_SCROLL_SPEED || state.intensity >= EDGE_INTENSITY_THRESHOLD;
    let effectiveVelocity = baseVelocity;

    if (atEdgeSpeed && baseVelocity !== 0) {
      const now = getTimestamp();

      if (state.holdStartAt == null) {
        state.holdStartAt = now;
      }

      const elapsed = now - state.holdStartAt;
      const multiplier =
        EDGE_MAX_TIME_MULTIPLIER === 1
          ? 1
          : Math.min(
              1 + (elapsed / EDGE_TIME_TO_MAX_MS) * (EDGE_MAX_TIME_MULTIPLIER - 1),
              EDGE_MAX_TIME_MULTIPLIER
            );
      const boosted = Math.abs(baseVelocity) * multiplier;
      const capped = Math.min(boosted, MAX_SCROLL_SPEED * EDGE_MAX_TIME_MULTIPLIER);
      effectiveVelocity = Math.sign(baseVelocity) * Math.round(capped);
    } else {
      state.holdStartAt = null;
    }

    if (effectiveVelocity === 0) {
      resetScroll();
      return;
    }

    window.scrollBy({
      top: effectiveVelocity,
      left: 0,
      behavior: 'auto',
    });

    if (state.baseVelocity === 0) {
      resetScroll();
      return;
    }

    state.frameId = requestAnimationFrame(stepScroll);
  }, [resetScroll]);

  const updateScrollVelocity = useCallback(
    ({ velocity, intensity }) => {
      const state = scrollState.current;
      const nextVelocity = velocity ?? 0;
      const nextIntensity = intensity ?? 0;
      const prevVelocity = state.baseVelocity;
      const previousDirection = Math.sign(prevVelocity);
      const nextDirection = Math.sign(nextVelocity);

      if (nextVelocity === 0) {
        if (state.baseVelocity !== 0) {
          resetScroll();
        }
        return;
      }

      state.baseVelocity = nextVelocity;
      state.intensity = nextIntensity;

      const atEdgeSpeed =
        Math.abs(nextVelocity) >= MAX_SCROLL_SPEED || nextIntensity >= EDGE_INTENSITY_THRESHOLD;

      if (atEdgeSpeed && nextDirection !== 0) {
        const now = getTimestamp();
        if (state.holdStartAt == null || nextDirection !== previousDirection) {
          state.holdStartAt = now;
        }
      } else {
        state.holdStartAt = null;
      }

      if (state.frameId == null) {
        state.frameId = requestAnimationFrame(stepScroll);
      }
    },
    [resetScroll, stepScroll]
  );

  useEffect(() => resetScroll, [resetScroll]);

  const calculateScrollVelocity = useCallback((event) => {
    if (typeof window === 'undefined') return { velocity: 0, intensity: 0 };

    const activeRect = event?.active?.rect?.current?.translated ?? event?.active?.rect?.current;

    if (!activeRect) return { velocity: 0, intensity: 0 };

    const viewportHeight = window.innerHeight;
    const edgeThreshold = Math.min(SCROLL_EDGE_THRESHOLD, viewportHeight / 2);
    const denominator = edgeThreshold || 1;
    const topThreshold = edgeThreshold;
    const bottomThreshold = viewportHeight - edgeThreshold;
    const rectTop = activeRect.top ?? 0;
    const rectBottom = activeRect.bottom ?? 0;

    if (rectTop < topThreshold) {
      const overlap = Math.min(topThreshold - rectTop, edgeThreshold);
      const normalized = Math.min(overlap / denominator, 1);
      const intensity = Math.pow(normalized, SCROLL_ACCELERATION_EXPONENT);
      return { velocity: -Math.round(intensity * MAX_SCROLL_SPEED), intensity };
    }

    if (rectBottom > bottomThreshold) {
      const overlap = Math.min(rectBottom - bottomThreshold, edgeThreshold);
      const normalized = Math.min(overlap / denominator, 1);
      const intensity = Math.pow(normalized, SCROLL_ACCELERATION_EXPONENT);
      return { velocity: Math.round(intensity * MAX_SCROLL_SPEED), intensity };
    }

    return { velocity: 0, intensity: 0 };
  }, []);

  const DragOverlayItem = dragOverlayComponent;

  const handleDragStart = (event) => {
    const { active } = event;

    recentlyMovedToNewContainer.current = false;
    notifyDragStart();
    setActiveItem(allItems.find((item) => item.id === active.id));
    const scrollUpdate = calculateScrollVelocity(event);
    updateScrollVelocity(scrollUpdate);
  };

  const handleDragMove = (event) => {
    const scrollUpdate = calculateScrollVelocity(event);
    updateScrollVelocity(scrollUpdate);
  };

  const handleDragOver = (event) => {
    const scrollUpdate = calculateScrollVelocity(event);
    updateScrollVelocity(scrollUpdate);

    const reorderProps = reorderPropsFromDragEvent(event, allItems);

    if (!reorderProps) return;

    if (reorderProps.activeItem?.id === reorderProps.overItem?.id && reorderProps.activeContainerId === reorderProps.overContainerId) {
      return;
    }

    if (reorderProps.activeContainerId !== reorderProps.overContainerId) {
      recentlyMovedToNewContainer.current = true;
    }

    onReordering(reorderProps);
  };

  const handleDragEnd = (event) => {
    scheduleRecentlyMovedReset();
    notifyDragEnd();
    setActiveItem(null);
    resetScroll();

    const reorderProps = reorderPropsFromDragEvent(event, allItems);

    if (!reorderProps) return;

    onReordered(reorderProps);
  };

  const handleDragCancel = () => {
    scheduleRecentlyMovedReset();
    notifyDragEnd();
    setActiveItem(null);
    resetScroll();
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      const activeId = args?.active?.id ?? activeItem?.id;
      const droppableContainersArray = args.droppableContainers.filter
        ? args.droppableContainers
        : Array.from(args.droppableContainers?.values?.() ?? []);

      const pointerIntersections = pointerWithin(args);
      const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        const overContainer = droppableContainersArray.find((container) => container.id === overId);
        const overData = overContainer?.data?.current;

        if (overData && overData.containerId && !overData.sortable) {
          const { containerId } = overData;
          const containerItemIds = itemsByContainer[containerId] ?? [];

          if (containerItemIds.length > 0) {
            const closestChild = closestCenter({
              ...args,
              droppableContainers: droppableContainersArray.filter((container) =>
                containerItemIds.includes(container.id)
              ),
            });
            const [firstChildCollision] = closestChild;
            overId = firstChildCollision?.id ?? overId;
          }
        }

        if (overId != null) {
          lastOverId.current = overId;
          return [{ id: overId }];
        }
      }

      if (recentlyMovedToNewContainer.current && activeId != null) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeItem, itemsByContainer]
  );

  return (
    <DndContext
      autoScroll={false}
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      collisionDetection={collisionDetectionStrategy}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay className="drag-overlay">{activeItem ? <DragOverlayItem item={activeItem} /> : null}</DragOverlay>
    </DndContext>
  );
};
