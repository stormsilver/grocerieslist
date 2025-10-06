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

export const SortableLists = ({ dragOverlayComponent, allItems, onReordering, onReordered, children }) => {
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
      // console.log('collisionDetectionStrategy', args);
      const activeId = activeItem.id;
      if (activeId && activeId in allItems) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => container.id in allItems),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in allItems) {
          const containerItems = allItems[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id !== overId && containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeItem, allItems]
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
