import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const SortableList = ({ containerId, collapsed, items, sortableItemComponent, neededItemsOnly }) => {
  const SortableItem = sortableItemComponent;
  const { setNodeRef, isOver } = useDroppable({ id: `empty-${containerId}`, data: { containerId } });

  const containerClassName = classNames('sortable-list', {
    'sortable-list--empty': !collapsed && items.length === 0,
    'sortable-list--drag-over': isOver,
  });

  const renderItems = () => {
    if (collapsed) return null;
    return items.map((item) => <SortableItem key={item.itemId} item={item} neededItemsOnly={neededItemsOnly} />);
  };

  return (
    <SortableContext id={containerId} items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className={containerClassName}>
        {renderItems()}
        {!collapsed && items.length === 0 ? <div className="sortable-list__placeholder" aria-hidden /> : null}
      </div>
    </SortableContext>
  );
};
