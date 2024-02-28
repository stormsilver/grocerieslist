import { useState } from 'react';
import { DragOverlay, DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export const SortableLists = ({ dragOverlayComponent, allItems, onReordering, onReordered, children }) => {
  const [activeItem, setActiveItem] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const DragOverlayItem = dragOverlayComponent;

  const handleDragStart = (event) => {
    // console.log('drag start event: ', event);
    const { active } = event;

    setActiveItem(allItems.find((item) => item.id === active.id));
  };

  const handleDragOver = (event) => {
    // console.log('drag over event: ', event);
    const { active, over } = event;
    const activeContainerId = active.data.current.sortable.containerId;
    const overContainerId = over.data.current.sortable.containerId;

    if (active.id === over.id) return;

    onReordering({
      activeContainerId,
      activeItem: allItems.find((item) => item.id === active.id),
      overContainerId,
      overItem: allItems.find((item) => item.id === over.id),
    });
  };

  const handleDragEnd = (event) => {
    // console.log('drag end event: ', event);
    const { active, over } = event;
    const activeContainerId = active.data.current.sortable.containerId;
    const overContainerId = over.data.current.sortable.containerId;

    setActiveItem(null);
    onReordered({
      activeContainerId,
      activeItem: allItems.find((item) => item.id === active.id),
      overContainerId,
      overItem: allItems.find((item) => item.id === over.id),
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>{activeItem ? <DragOverlayItem item={activeItem} /> : null}</DragOverlay>
    </DndContext>
  );
};
