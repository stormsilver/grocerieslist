import { AddItemButton } from '../AddItemButton';
import { SectionHeader } from '../SectionHeader';
import { SortableList } from '../SortableList';
import { SortableItem } from '../SortableItem';

export const Category = ({ category, collapsed, onToggleCollapse, items }) => {
  const toggleCollapse = () => {
    onToggleCollapse(category.id);
  };

  return (
    <div>
      <SectionHeader title={category.name} collapsed={collapsed} onToggleCollapse={toggleCollapse}>
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
