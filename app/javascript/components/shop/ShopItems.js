import { SortableList } from '../SortableList';
import { SortableItem } from '../SortableItem';

export const ShopItems = ({ containerId, items, neededItemsOnly }) => {
  return (
    <div className="shop-items container-fluid">
      <SortableList
        containerId={containerId}
        items={items}
        sortableItemComponent={SortableItem}
        neededItemsOnly={neededItemsOnly}
      />
    </div>
  );
};
