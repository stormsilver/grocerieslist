import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CategoryItem } from './CategoryItem';

export const SortableCategoryItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <CategoryItem item={item} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};
