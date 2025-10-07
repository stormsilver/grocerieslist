import { useDroppable } from '@dnd-kit/core';
import { AddItemButton } from '../AddItemButton';
import { SectionHeader } from '../SectionHeader';
import { SortableList } from '../SortableList';
import { SortableItem } from '../SortableItem';

export const Category = ({ category, collapsed, onToggleCollapse, items }) => {
  const { setNodeRef: setHeaderNodeRef, isOver: isHeaderOver } = useDroppable({
    id: `category-header-${category.id}`,
    data: { containerId: category.id, type: 'category-header' },
    disabled: !collapsed,
  });

  const toggleCollapse = () => {
    onToggleCollapse(category.id);
  };

  const highlightHeader = collapsed && isHeaderOver;

  return (
    <div>
      <SectionHeader
        ref={setHeaderNodeRef}
        title={category.name}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        dragOver={highlightHeader}
      >
        <AddItemButton category={category} />
      </SectionHeader>

      <div className="container-fluid">
        <SortableList
          containerId={category.id}
          collapsed={collapsed}
          items={items}
          sortableItemComponent={SortableItem}
        />
      </div>
    </div>
  );
};
