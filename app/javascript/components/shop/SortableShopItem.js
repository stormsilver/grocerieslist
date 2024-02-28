import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ShopItem } from './ShopItem';

export const SortableShopItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <ShopItem item={item} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};
