import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const SortableList = ({ containerId, collapsed, items, sortableItemComponent, neededItemsOnly }) => {
  const SortableItem = sortableItemComponent;
  const { setNodeRef } = useDroppable({ id: `empty-${containerId}`, data: { containerId } });

  const renderItems = () => {
    if (collapsed) return null;
    return items.map((item) => <SortableItem key={item.itemId} item={item} neededItemsOnly={neededItemsOnly} />);
  };

  return (
    <SortableContext id={containerId} items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="sortable-list">
        {renderItems()}
      </div>
    </SortableContext>
  );
};
