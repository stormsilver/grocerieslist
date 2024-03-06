import { useState } from 'react';
import { DragOverlay, DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

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
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const DragOverlayItem = dragOverlayComponent;

  const handleDragStart = (event) => {
    // console.log('drag start event: ', event);
    const { active } = event;

    setActiveItem(allItems.find((item) => item.id === active.id));
  };

  const handleDragOver = (event) => {
    console.log('drag over event: ', event);

    const reorderProps = reorderPropsFromDragEvent(event, allItems);

    if (reorderProps.activeItem.id === reorderProps.overItem?.id) return;

    onReordering(reorderProps);
  };

  const handleDragEnd = (event) => {
    // console.log('drag end event: ', event);

    setActiveItem(null);

    const reorderProps = reorderPropsFromDragEvent(event, allItems);

    onReordered(reorderProps);
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
