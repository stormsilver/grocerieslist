import { SortableList } from '../SortableList';
import { SortableItem } from '../SortableItem';
import { SectionHeader } from '../SectionHeader';

export const ShopItems = ({ containerId, items, neededItemsOnly, title }) => {
  return (
    <div>
      <SectionHeader title={title} />
      <div className="container-fluid">
        <SortableList
          containerId={containerId}
          items={items}
          sortableItemComponent={SortableItem}
          neededItemsOnly={neededItemsOnly}
        />
      </div>
    </div>
  );
};
