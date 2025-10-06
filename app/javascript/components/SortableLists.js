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

const reorderPropsFromDragEvent = (event, allItems) => {
  const { active, over } = event;

  const currentActive = active.data.current;
  const currentOver = over.data.current;

  const activeContainerId = currentActive.sortable ? currentActive.sortable.containerId : currentActive.containerId;
  const overContainerId = currentOver.sortable ? currentOver.sortable.containerId : currentOver.containerId;

  return {
    activeContainerId,
    activeItem: allItems.find((item) => item.id === active.id),
    overContainerId,
    overItem: allItems.find((item) => item.id === over.id),
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

  const DragOverlayItem = dragOverlayComponent;

  const handleDragStart = (event) => {
    const { active } = event;

    setActiveItem(allItems.find((item) => item.id === active.id));
  };

  const handleDragOver = (event) => {
    const reorderProps = reorderPropsFromDragEvent(event, allItems);

    if (reorderProps.activeItem.id === reorderProps.overItem?.id) return;

    if (reorderProps.activeContainerId !== reorderProps.overContainerId) {
      recentlyMovedToNewContainer.current = true;
    }

    onReordering(reorderProps);
  };

  const handleDragEnd = (event) => {
    setActiveItem(null);

    const reorderProps = reorderPropsFromDragEvent(event, allItems);

    onReordered(reorderProps);
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

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [allItems]);

  return (
    <DndContext
      autoScroll={{
        enabled: true,
        acceleration: 3000,
        threshold: { x: 0.25, y: 0.25 },
      }}
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      collisionDetection={collisionDetectionStrategy}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay className="drag-overlay">{activeItem ? <DragOverlayItem item={activeItem} /> : null}</DragOverlay>
    </DndContext>
  );
};
