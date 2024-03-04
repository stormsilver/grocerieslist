import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item } from './Item';
import { DragHandle } from './DragHandle';

export const SortableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item item={item} ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        <DragHandle />
      </div>
    </Item>
  );
};
