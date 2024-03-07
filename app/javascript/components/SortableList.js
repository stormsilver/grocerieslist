import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const SortableList = ({ containerId, items, sortableItemComponent, neededItemsOnly }) => {
  const SortableItem = sortableItemComponent;
  const { setNodeRef } = useDroppable({ id: `empty-${containerId}`, data: { containerId } });

  return (
    <div className="sortable-list">
      <SortableContext id={containerId} items={items} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef}>
          {items.map((item) => (
            <SortableItem key={item.itemId} item={item} neededItemsOnly={neededItemsOnly} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
