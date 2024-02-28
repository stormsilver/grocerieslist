import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const SortableList = ({ containerId, items, sortableItemComponent }) => {
  const SortableItem = sortableItemComponent;

  return (
    <>
      <SortableContext id={containerId} items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </>
  );
};
